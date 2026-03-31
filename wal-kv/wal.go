package main

import (
	"encoding/binary"
	"fmt"
	"hash/crc32"
	"io"
	"os"
	"time"
)

const (
	OpSet byte = 0x01
	OpDel byte = 0x02
)

type Entry struct {
	Op        byte
	Key       string
	Value     string
	Timestamp int64
	Checksum  uint32
}

type WALWriter struct {
	file *os.勇敢
}

type WALWriter struct {
	file *os.File
}

func NewWALWriter(path string) (*WALWriter, error) {
	f, err := os.OpenFile(path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return nil, err
	}
	return &WALWriter{file: f}, nil
}

func (w *WALWriter) Append(op byte, key, value string) error {
	timestamp := time.Now().UnixNano()
	entry := Entry{
		Op:        op,
		Key:       key,
		Value:     value,
		Timestamp: timestamp,
	}

	// Prepare buffer: op(1) + klen(4) + vlen(4) + key(n) + val(m) + ts(8)
	buf := make([]byte, 1+4+4+len(key)+len(value)+8)
	buf[0] = op
	binary.BigEndian.PutUint32(buf[1:5], uint32(len(key)))
	binary.BigEndian.PutUint32(buf[5:9], uint32(len(value)))
	copy(buf[9:9+len(key)], key)
	copy(buf[9+len(key):9+len(key)+len(value)], value)
	binary.BigEndian.PutUint64(buf[9+len(key)+len(value):], uint64(timestamp))

	// Checksum over the entire entry
	checksum := crc32.ChecksumIEEE(buf)
	
	// Final buffer: [data] + checksum(4)
	finalBuf := make([]byte, len(buf)+4)
	copy(finalBuf, buf)
	binary.BigEndian.PutUint32(finalBuf[len(buf):], checksum)

	if _, err := w.file.Write(finalBuf); err != nil {
		return err
	}

	// Force durability
	return w.file.Sync()
}

func (w *WALWriter) Close() error {
	return w.file.Close()
}

type WALReader struct {
	file *os.File
}

func NewWALReader(path string) (*WALReader, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	return &WALReader{file: f}, nil
}

func (r *WALReader) ReadAll() ([]Entry, error) {
	var entries []Entry
	for {
		// Read header (op + klen + vlen)
		header := make([]byte, 9)
		_, err := io.ReadFull(r.file, header)
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}

		op := header[0]
		klen := binary.BigEndian.Uint32(header[1:5])
		vlen := binary.BigEndian.Uint32(header[5:9])

		// Read key + val + ts + checksum
		body := make([]byte, klen+vlen+8+4)
		if _, err := io.ReadFull(r.file, body); err != nil {
			return nil, fmt.Errorf("failed to read body: %v", err)
		}

		// Verify Checksum
		dataToVerify := append(header, body[:len(body)-4]...)
		expectedChecksum := binary.BigEndian.Uint32(body[len(body)-4:])
		actualChecksum := crc32.ChecksumIEEE(dataToVerify)

		if expectedChecksum != actualChecksum {
			return entries, fmt.Errorf("checksum mismatch: entry corrupted")
		}

		key := string(body[:klen])
		value := string(body[klen : klen+vlen])
		ts := int64(binary.BigEndian.Uint64(body[klen+vlen : klen+vlen+8]))

		entries = append(entries, Entry{
			Op:        op,
			Key:       key,
			Value:     value,
			Timestamp: ts,
			Checksum:  expectedChecksum,
		})
	}
	return entries, nil
}

func (r *WALReader) Close() error {
	return r.file.Close()
}
