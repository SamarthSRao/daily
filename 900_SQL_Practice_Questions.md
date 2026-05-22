# 🗄️ 900 SQL Practice Questions — Interview Mastery Guide

> **Difficulty:** Easy & Medium only | **Focus:** Real fresher & junior developer interviews  
> **Domains:** E-Commerce · Ride-Sharing · Delivery · Payments · HR · Social Media · Core SQL  
> **Tags:** Every question tagged with `[Concept]` for targeted practice

---

## 📋 Table of Contents

1. [🛒 E-Commerce SQL](#1--e-commerce-sql) — 265 questions
2. [🚗 Ride-Sharing SQL](#2--ride-sharing-sql-uber--ola) — 140 questions
3. [🛵 Delivery SQL](#3--food--package-delivery-sql) — 135 questions
4. [💳 Payments SQL](#4--payments--fintech-sql) — 135 questions
5. [👥 HR & Employees SQL](#5--hr--employee-sql) — 82 questions
6. [📱 Social Media SQL](#6--social-media-sql) — 52 questions
7. [📚 Core SQL Concepts](#7--core-sql-concepts) — 100 questions

---

## 1. 🛒 E-Commerce SQL

> **Schema:**
> ```
> customers(customer_id, name, email, city, state, created_at, tier)
> products(product_id, name, category, brand, price, cost_price, stock_qty, seller_id)
> orders(order_id, customer_id, order_date, status, total_amount, discount, payment_method)
> order_items(item_id, order_id, product_id, quantity, unit_price, returned)
> reviews(review_id, product_id, customer_id, rating, review_date, helpful_votes)
> sellers(seller_id, name, city, commission_pct, joined_date, rating)
> coupons(coupon_id, code, discount_type, discount_value, min_order_value, expiry_date)
> categories(category_id, name, parent_category_id)
> wishlists(wishlist_id, customer_id, product_id, added_at)
> returns(return_id, order_id, product_id, reason, status, refund_amount, return_date)
> ```

---

### 1.1 Basic SELECT & Filtering

1. List all customers from Bengaluru who signed up after January 2023. `[SELECT]`
2. Find all products with price between ₹500 and ₹2000 in the Electronics category. `[SELECT]`
3. Show all orders placed in the last 30 days with status 'delivered'. `[SELECT]`
4. Retrieve all distinct product categories available on the platform. `[SELECT]`
5. List all customers whose email ends with 'gmail.com'. `[SELECT]`
6. Find all products that are currently out of stock (stock_qty = 0). `[SELECT]`
7. Show the top 10 most expensive products sorted by price descending. `[SELECT]`
8. List all orders where discount is greater than 0. `[SELECT]`
9. Find all customers who registered in the month of December. `[SELECT]`
10. Retrieve all sellers based in Mumbai with a rating above 4.0. `[SELECT]`
11. List all products from the 'Nike' brand priced below ₹3000. `[SELECT]`
12. Find all orders with payment method 'Cash on Delivery'. `[SELECT]`
13. Show all returned items with reason 'defective'. `[SELECT]`
14. List all coupons that are currently active (expiry_date > today). `[SELECT]`
15. Find all Gold-tier customers sorted by created_at. `[SELECT]`
16. Show all products with stock quantity less than 10 (low stock alert). `[SELECT]`
17. List all orders placed by a specific customer (customer_id = 101). `[SELECT]`
18. Find products whose name contains the word 'wireless'. `[LIKE]`
19. Show all sellers who joined the platform in 2023. `[SELECT]`
20. Find all orders with total_amount greater than ₹10,000. `[SELECT]`

---

### 1.2 Aggregations & GROUP BY

21. Find the total revenue generated per product category. `[GROUP BY]`
22. Calculate the average order value across all orders. `[AGG]`
23. Count the number of orders placed per month for the current year. `[GROUP BY]`
24. Find the average product rating per category. `[GROUP BY]`
25. Get the total number of returns grouped by return reason. `[GROUP BY]`
26. Find the seller with the highest number of products listed. `[GROUP BY]`
27. Calculate total revenue and total order count per payment method. `[GROUP BY]`
28. Find the top 5 cities by number of registered customers. `[GROUP BY]`
29. Count how many orders each customer has placed. `[GROUP BY]`
30. Find all categories where the average product price is above ₹1000. `[HAVING]`
31. Calculate total discount given across all orders per month. `[GROUP BY]`
32. Find the total quantity of each product sold across all orders. `[GROUP BY]`
33. Count the number of reviews per product and show only products with more than 10 reviews. `[HAVING]`
34. Find the maximum and minimum order value per customer tier. `[GROUP BY]`
35. Calculate the total refund amount processed per month. `[GROUP BY]`
36. Count orders by status (pending, delivered, cancelled) per city. `[GROUP BY]`
37. Find the brand with the highest number of products listed. `[GROUP BY]`
38. Calculate average rating given by each customer across all their reviews. `[GROUP BY]`
39. Find the number of unique customers who ordered in each month. `[GROUP BY]`
40. Calculate total sales (unit_price × quantity) per order. `[GROUP BY]`

---

### 1.3 INNER JOINs

41. List each order along with the customer's name and city. `[JOIN]`
42. Show all products with their seller's name and seller's rating. `[JOIN]`
43. List each order item with product name, quantity, and unit price. `[JOIN]`
44. Show all reviews with the reviewer's name and the product name. `[JOIN]`
45. Find all orders with customer name and payment method used. `[JOIN]`
46. Get each seller's total revenue from their products. `[JOIN+GROUP]`
47. Show all order items with the corresponding order date and status. `[JOIN]`
48. List all products along with their category name. `[JOIN]`
49. Show all returns with the customer name and product name. `[JOIN]`
50. Find all orders placed by Gold-tier customers. `[JOIN]`
51. List all wishlisted products with the customer name and product price. `[JOIN]`
52. Show each product with its brand and current stock quantity. `[JOIN]`
53. Get the total number of orders per seller. `[JOIN+GROUP]`
54. List all order items where the product category is 'Clothing'. `[JOIN]`
55. Show all reviews with rating 5 and the product name. `[JOIN]`

---

### 1.4 LEFT JOINs (Find Missing / Unmatched)

56. Find all customers who have never placed an order. `[LEFT JOIN]`
57. Find all products that have never been ordered. `[LEFT JOIN]`
58. List all sellers who have no products listed. `[LEFT JOIN]`
59. Find products that have never been reviewed. `[LEFT JOIN]`
60. List customers who have never used a coupon. `[LEFT JOIN]`
61. Find products that exist in the catalog but have never been wishlisted. `[LEFT JOIN]`
62. List sellers who have no returns on any of their products. `[LEFT JOIN]`
63. Find all customers who have placed orders but never left a review. `[LEFT JOIN]`
64. List all categories with no products assigned to them. `[LEFT JOIN]`
65. Find products that are wishlisted but have never been purchased. `[LEFT JOIN]`

---

### 1.5 Subqueries

66. Find all customers who have spent more than the average order amount. `[Subquery]`
67. Get products whose price is above the average price in their category. `[Subquery]`
68. Find the most recent order for each customer. `[Subquery]`
69. List products that have never been returned. `[Subquery]`
70. Find the seller with the highest average product rating. `[Subquery]`
71. Get the customer who placed the highest single order by value. `[Subquery]`
72. Find all orders where the total_amount is above the monthly average. `[Subquery]`
73. List products cheaper than the cheapest product in the Electronics category. `[Subquery]`
74. Find customers whose total spending is above the platform average. `[Subquery]`
75. Get the top 3 most reviewed products. `[Subquery]`
76. Find all orders that contain more than 5 different products. `[Subquery]`
77. List sellers whose average product price is below ₹500. `[Subquery]`
78. Find the product with the most returns. `[Subquery]`
79. Get all customers who ordered in the same month they registered. `[Subquery]`
80. Find categories where no product has been returned. `[Subquery]`

---

### 1.6 CTEs (Common Table Expressions)

81. Use a CTE to find the top 5 customers by total lifetime spend. `[CTE]`
82. Write a CTE to calculate total revenue per month and display with month name. `[CTE]`
83. Use CTE to find sellers ranked by total revenue from their products. `[CTE]`
84. CTE to find the best-selling product in each category. `[CTE]`
85. Use CTE to compute average order value per city and rank cities. `[CTE]`
86. Write a CTE to calculate the return rate per product (returns / orders). `[CTE]`
87. Use CTE to find customers who placed orders in 3 or more consecutive months. `[CTE]`
88. CTE to identify products with more returns than sales in the last 30 days. `[CTE]`
89. Use CTE to find the top 3 products by revenue per seller. `[CTE]`
90. Write a CTE to compute the repeat purchase rate per product. `[CTE]`
91. Use CTE to find the monthly active customer count for the last 6 months. `[CTE]`
92. CTE to calculate the refund-to-revenue ratio per category. `[CTE]`
93. Use CTE to list sellers at risk (no orders on their products in last 30 days). `[CTE]`
94. Write a CTE to find the category with the fastest sales velocity. `[CTE]`
95. Use CTE to compute total discount given per customer tier per month. `[CTE]`

---

### 1.7 Window Functions

96. Rank customers by total spend using RANK() and DENSE_RANK(). `[Window]`
97. Calculate the running total of daily revenue ordered by date. `[Window]`
98. Find each customer's most recent order using ROW_NUMBER() OVER (PARTITION BY customer_id). `[Window]`
99. Use LAG() to find the previous month's revenue and compute month-over-month change. `[Window]`
100. Use LEAD() to find the next order date for each customer. `[Window]`
101. Find the top 3 products by revenue in each category using RANK(). `[Window]`
102. Compute the percentage of total revenue each product contributes using SUM() OVER(). `[Window]`
103. Use NTILE(4) to segment customers into 4 spending quartiles. `[Window]`
104. Find each seller's rank by total revenue using DENSE_RANK() OVER (PARTITION BY city). `[Window]`
105. Use FIRST_VALUE() to get the first product each customer ever purchased. `[Window]`
106. Calculate the 3-month moving average of monthly order count. `[Window]`
107. Use ROW_NUMBER() to deduplicate reviews, keeping only the latest per customer per product. `[Window]`
108. Find the top 2 customers by spend per city using RANK(). `[Window]`
109. Compute each product's revenue share within its category using SUM() OVER(PARTITION BY). `[Window]`
110. Use LAST_VALUE() to find the most recent return reason for each product. `[Window]`

---

### 1.8 Commonly Asked Interview Scenarios

111. Find the total revenue per month for the current year. `[Analytics]`
112. List the top 5 best-selling products by quantity sold. `[Analytics]`
113. Find customers who have placed more than 5 orders. `[Analytics]`
114. Calculate the average rating per seller based on their products. `[Analytics]`
115. Find the most common payment method used in each city. `[Analytics]`
116. Get the month with the highest number of returns. `[Analytics]`
117. Find products that were ordered but never reviewed. `[Analytics]`
118. Calculate the average time between order_date and return_date for returned items. `[Analytics]`
119. List the top 3 sellers by number of 5-star product reviews. `[Analytics]`
120. Find customers who placed an order every month for the last 3 months. `[Analytics]`
121. Calculate how many orders each coupon code was applied to. `[Analytics]`
122. Find the city with the highest average order value. `[Analytics]`
123. List products that have been purchased by more than 100 distinct customers. `[Analytics]`
124. Find the return rate (returns/orders) per product category. `[Analytics]`
125. Calculate total commission earned from each seller this month. `[Analytics]`
126. Find the average number of items per order per customer. `[Analytics]`
127. List sellers who have both a high rating (>4.5) and high revenue (top 20%). `[Analytics]`
128. Find products where stock is below the average sales per day (will run out soon). `[Analytics]`
129. Calculate the percentage of orders that had a discount applied. `[Analytics]`
130. Find the most popular product in each state. `[Analytics]`

---

### 1.9 Additional Practice

131. Find the average number of days between a customer's first and second order. `[Analytics]`
132. List all products with more 1-star reviews than 5-star reviews. `[Subquery]`
133. Calculate the basket size distribution: orders with 1, 2, 3, 4, 5+ items. `[CASE]`
134. Find all orders placed and cancelled on the same day. `[Analytics]`
135. Get each seller's month-over-month revenue change using LAG(). `[Window]`
136. Find customers who used the same coupon code more than once. `[GROUP BY]`
137. List all products that have a higher return rate than the category average. `[Subquery]`
138. Find the top 5 products by wishlist additions that have never been purchased. `[LEFT JOIN]`
139. Calculate the average review score per brand. `[GROUP BY]`
140. Find all sellers with commission earned above ₹50,000 this month. `[Analytics]`
141. Get the number of distinct products each customer has ever ordered. `[GROUP BY]`
142. Find categories where every product has at least one review. `[Subquery]`
143. List the top 3 most returned products per category. `[Window]`
144. Calculate average discount per customer tier. `[GROUP BY]`
145. Find products added to a wishlist in the last 7 days that are currently on sale. `[JOIN]`
146. Count new customers acquired per month (first order month). `[CTE]`
147. Find the most active hour of day for order placements. `[GROUP BY]`
148. List products with no reviews but with at least 10 orders. `[LEFT JOIN]`
149. Calculate the revenue contribution of each city as a % of total. `[Window]`
150. Find all orders where the applied discount made the profit negative. `[Analytics]`
151. List customers who have reviewed every product they ordered. `[Subquery]`
152. Find the seller who has the widest price range (max price - min price) of products. `[GROUP BY]`
153. Calculate return rate by payment method. `[GROUP BY]`
154. Find the top 3 categories by unique customer count. `[GROUP BY]`
155. List products priced within 10% of the category average. `[Subquery]`
156. Find all repeat customers (more than 1 order) per city. `[GROUP BY]`
157. Calculate the total weight of orders (using product weight column if available). `[GROUP BY]`
158. Find the day of the week with the highest order volume. `[GROUP BY]`
159. List all coupons that generated more than ₹1,00,000 in discount. `[GROUP BY]`
160. Find products that have been continuously in stock for the last 30 days. `[Analytics]`
161. Find the average order value per day of week. `[GROUP BY]`
162. List customers who placed an order within 1 hour of registering. `[Analytics]`
163. Calculate each product's rank by number of wishlists it appears in. `[Window]`
164. Find sellers who have never had a return on any product. `[LEFT JOIN]`
165. Calculate the total platform revenue (sum of all order amounts minus discounts). `[AGG]`
166. Find customers whose average order value increased between Q1 and Q2. `[CTE]`
167. List the top 5 most used coupon codes by discount amount. `[GROUP BY]`
168. Find orders where the number of items exceeds the customer's average basket size. `[Subquery]`
169. Calculate the share of wallet per category for each customer. `[Window]`
170. Find products that are in the top 10% by price in their category. `[Window]`
171. List all sellers with at least one product in stock and at least one out of stock. `[GROUP BY]`
172. Find the month with the most new customer registrations. `[GROUP BY]`
173. Calculate total revenue from each customer tier. `[GROUP BY]`
174. List all orders that contained both Electronics and Clothing items. `[JOIN]`
175. Find the average age of orders currently in 'pending' status. `[Analytics]`
176. Calculate the % of revenue from the top 10 products. `[Window]`
177. Find customers who spent more in December than any other month. `[Subquery]`
178. List all products where price is lower than the average for their brand. `[Subquery]`
179. Calculate the on-time delivery rate per city (delivered before promised date). `[Analytics]`
180. Find all sellers who earned more than ₹1,00,000 in a single month. `[Analytics]`
181. Get the total number of items returned per seller. `[JOIN+GROUP]`
182. Find the customer with the most diverse purchase history (most categories). `[GROUP BY]`
183. Calculate the coupon utilization rate (used_count / usage_limit). `[SELECT]`
184. Find the most popular product per age group of customer (if age available). `[GROUP BY]`
185. List all products where the seller rating is below 3.5. `[JOIN]`
186. Calculate the average time between restock events per product. `[Analytics]`
187. Find all orders where total_amount does not match the sum of order_items. `[Analytics]`
188. List the top 3 cities by total discount amount given. `[GROUP BY]`
189. Find all customers who have a wishlist but no orders. `[LEFT JOIN]`
190. Calculate the monthly growth rate of total orders using LAG(). `[Window]`
191. Find products that appear together in the same order more than 50 times. `[JOIN]`
192. List all sellers with both highest and lowest rated products. `[Subquery]`
193. Calculate the refund amount as a percentage of original order value. `[Analytics]`
194. Find customers who always choose the same payment method. `[GROUP BY]`
195. List the top 10 products by net revenue (revenue - refunds). `[Analytics]`
196. Find the average rating of products by seller city. `[GROUP BY]`
197. Calculate the order volume change between this week and last week. `[CTE]`
198. Find customers who have never made a return despite ordering 10+ times. `[LEFT JOIN]`
199. List all products that have been in the top 10 sellers for 3+ months. `[CTE]`
200. Find the most common order size (₹0-500, ₹500-2000, ₹2000+) per city. `[CASE+GROUP]`
201. Get the cumulative revenue per seller ordered by month. `[Window]`
202. Find categories where the total stock value (price × stock_qty) exceeds ₹10,00,000. `[GROUP BY]`
203. List all orders with a discount above 50% of the product's cost price. `[JOIN]`
204. Find customers who only ever ordered from one seller. `[GROUP BY]`
205. Calculate the average number of days a product stays wishlisted before being purchased. `[Analytics]`
206. Find all products where the review count is 0 but return count is > 0. `[Analytics]`
207. List the top 5 brands by total customer reviews. `[GROUP BY]`
208. Find the seller with the most consistent rating (lowest standard deviation in product ratings). `[Analytics]`
209. Calculate week-over-week revenue growth using CTEs and LAG(). `[CTE+Window]`
210. List all customers who placed their first order using a coupon. `[Analytics]`
211. Find products that have been ordered in all 12 months of the current year. `[Subquery]`
212. Calculate the revenue lost to returns per seller per month. `[Analytics]`
213. Find all orders where the same product appears more than once as a line item. `[Analytics]`
214. List cities where the average order value has grown month over month for 3 months. `[CTE]`
215. Find the top seller in each product category by revenue. `[Window]`
216. Calculate the median order value per customer tier using PERCENTILE_CONT. `[Window]`
217. Find all customers who referred another customer who then made a purchase. `[JOIN]`
218. List products that have a higher average review score from verified buyers. `[JOIN]`
219. Find the percentage of orders that resulted in at least one item being returned. `[Analytics]`
220. Calculate the seller performance score = avg_rating × 0.5 + on_time_rate × 0.5. `[Analytics]`
221. Find all products with exactly 0 stock that have pending orders. `[JOIN]`
222. List the top 5 days of the year by total revenue. `[GROUP BY]`
223. Find customers who changed their delivery city across consecutive orders. `[Window]`
224. Calculate the percentage of revenue generated during weekends. `[Analytics]`
225. Find the earliest and latest order date per seller. `[GROUP BY]`
226. List all products where the return rate improved (decreased) over the last 3 months. `[CTE]`
227. Find customers whose order value is always above ₹2000. `[Subquery]`
228. Calculate the customer acquisition trend (new customers per week) for the last month. `[GROUP BY]`
229. Find all sellers who have received both a 1-star and 5-star product review in the same month. `[Analytics]`
230. List the top 3 coupon codes by revenue saved for customers. `[GROUP BY]`
231. Find products that sold more than their stock quantity (data inconsistency check). `[Analytics]`
232. Calculate monthly active sellers (sellers with at least one order on their product). `[CTE]`
233. Find customers who ordered the same product more than twice. `[GROUP BY]`
234. List all sellers where commission_pct is above the platform average. `[Subquery]`
235. Find the average discount amount given per order in each city. `[GROUP BY]`
236. Calculate the revenue per active seller per month. `[CTE]`
237. Find products whose price is in the top 10% but rating is in the bottom 10%. `[Window]`
238. List customers with the most diverse payment method usage. `[GROUP BY]`
239. Find the seller with the fastest inventory turnover. `[Analytics]`
240. Calculate the number of orders per customer for their first 30 days on the platform. `[Analytics]`
241. Find all orders that contain only one unique product. `[GROUP BY]`
242. List the top 5 product categories by return rate. `[GROUP BY]`
243. Calculate each seller's rank by return rate using RANK(). `[Window]`
244. Find customers who have used every available payment method. `[GROUP BY]`
245. List all products with positive stock but zero orders in the last 60 days. `[LEFT JOIN]`
246. Find the average order value per day of month (1st, 2nd, etc.). `[GROUP BY]`
247. Calculate total revenue per quarter for the last 2 years. `[GROUP BY]`
248. Find all customers whose first order was above ₹5000. `[CTE]`
249. List sellers with an increasing trend in monthly revenue over the last 3 months. `[CTE+Window]`
250. Find the product that generates the highest revenue per review. `[Analytics]`
251. Calculate the share of orders using digital payment methods per city. `[GROUP BY]`
252. Find all products in the same category as the most returned product. `[Subquery]`
253. List customers who ordered within 24 hours of a product going on sale. `[Analytics]`
254. Find the most popular category per customer tier. `[GROUP BY]`
255. Calculate the average price drop at time of return for returned items. `[Analytics]`
256. Find all orders where the discount was applied but the coupon was expired. `[JOIN]`
257. List the top 3 sellers by total number of distinct customers served. `[GROUP BY]`
258. Find products with a consistent weekly sales pattern (same qty each week). `[Analytics]`
259. Calculate the compounding monthly growth rate of the platform's GMV. `[CTE]`
260. Find all customers who rated a product 5 stars and also returned it. `[JOIN]`
261. List the top 3 cities by revenue in each quarter. `[Window]`
262. Find the average time from order placement to delivery per seller. `[Analytics]`
263. Calculate total platform-wide GMV and compare Q1 vs Q2 using CTEs. `[CTE]`
264. Find products that are in high demand (top 20% orders) but low stock (bottom 20%). `[Window]`
265. List all sellers who improved their average rating by more than 0.5 over the past 6 months. `[Analytics]`

---

## 2. 🚗 Ride-Sharing SQL (Uber / Ola)

> **Schema:**
> ```
> riders(rider_id, name, phone, city, signup_date, referral_code, tier)
> drivers(driver_id, name, phone, city, vehicle_type, rating, status, joined_date, total_trips)
> trips(trip_id, rider_id, driver_id, pickup_area, drop_area, start_time, end_time, distance_km, fare, surge_multiplier, status, payment_method, cancelled_by)
> ratings(rating_id, trip_id, rater_type, rating_value, feedback, rated_at)
> driver_earnings(earning_id, driver_id, trip_id, gross_amount, platform_cut, net_amount, earning_date)
> surge_zones(zone_id, city, area_name, surge_multiplier, valid_from, valid_to)
> promo_codes(promo_id, code, discount_pct, max_discount, min_fare, usage_limit, used_count, expiry)
> cancellations(cancel_id, trip_id, cancelled_by, cancel_reason, cancel_time, penalty_amount)
> ```

---

### 2.1 Basic Queries

266. List all active drivers in Bengaluru city. `[SELECT]`
267. Find all trips completed on a specific date. `[SELECT]`
268. Show all cancelled trips with their cancellation reason. `[SELECT]`
269. Find all drivers with a rating below 3.5. `[SELECT]`
270. List all trips with surge multiplier greater than 1.5. `[SELECT]`
271. Find all riders who signed up using a referral code. `[SELECT]`
272. Show all trips longer than 20 km. `[SELECT]`
273. List all cash payment trips in a given city. `[SELECT]`
274. Find all drivers whose vehicle type is 'SUV'. `[SELECT]`
275. Find all trips that took more than 60 minutes. `[SELECT]`
276. List all riders registered in the last 7 days. `[SELECT]`
277. Find all trips with a fare above ₹500. `[SELECT]`
278. Show all promo codes that have expired. `[SELECT]`
279. Find all drivers with status 'offline'. `[SELECT]`
280. List all trips where the rider cancelled the trip. `[SELECT]`

---

### 2.2 Aggregations

281. Calculate total revenue per city per month. `[GROUP BY]`
282. Find the average trip distance per vehicle type. `[GROUP BY]`
283. Count total trips, completed and cancelled, per driver. `[GROUP BY]`
284. Find the peak hour (0–23) with the most trip requests. `[GROUP BY]`
285. Calculate average surge multiplier per pickup area. `[GROUP BY]`
286. Find the top 10 drivers by total earnings this month. `[GROUP BY]`
287. Calculate the cancellation rate (cancelled / total) per city. `[GROUP BY]`
288. Find the average rating given by riders vs. given by drivers. `[GROUP BY]`
289. Count how many riders used each payment method. `[GROUP BY]`
290. Find the average trip duration per pickup area. `[GROUP BY]`
291. Calculate total platform revenue (sum of platform_cut) per month. `[GROUP BY]`
292. Find the top 5 pickup areas by number of trips. `[GROUP BY]`
293. Count the number of unique riders per driver. `[GROUP BY]`
294. Calculate the average fare per kilometre per vehicle type. `[GROUP BY]`
295. Find the day of week with the highest number of trips. `[GROUP BY]`

---

### 2.3 JOINs

296. Show each trip with rider name, driver name, fare, and distance. `[JOIN]`
297. Find drivers who have never completed a trip. `[LEFT JOIN]`
298. Show all ratings with trip details and the name of the person who gave the rating. `[JOIN]`
299. List all trips with applicable surge zone info at the time of booking. `[JOIN]`
300. Find riders who have never given a rating after a trip. `[LEFT JOIN]`
301. Show driver earnings alongside their trip fare and platform cut. `[JOIN]`
302. Find all trips where a promo code was applied. `[JOIN]`
303. List drivers with unverified documents. `[LEFT JOIN]`
304. Get cancellation details with rider name and penalty amount. `[JOIN]`
305. Find riders who have taken trips with more than 3 different drivers. `[JOIN+GROUP]`
306. List all trips along with the pickup and drop area names. `[JOIN]`
307. Find drivers who have completed more than 100 trips but have a rating below 4.0. `[JOIN]`
308. Show each driver's total net earnings with their name and city. `[JOIN+GROUP]`
309. Find the trips that generated the highest platform revenue per city. `[JOIN]`
310. List all riders who used a promo code on their first trip. `[JOIN]`

---

### 2.4 CTEs & Window Functions

311. Use CTE to find the top 5 riders by number of trips this month. `[CTE]`
312. Rank drivers by total earnings per city using DENSE_RANK(). `[Window]`
313. Use ROW_NUMBER() to get each driver's most recent trip. `[Window]`
314. CTE to calculate driver churn (no trips in last 14 days). `[CTE]`
315. Calculate cumulative daily revenue using SUM() OVER (ORDER BY date). `[Window]`
316. Use LAG() to compare each driver's current vs. previous trip fare. `[Window]`
317. Find the median trip fare per city using PERCENTILE_CONT. `[Window]`
318. Rank pickup areas by trip volume per hour using RANK(). `[Window]`
319. Use LEAD() to find idle time between consecutive driver trips. `[Window]`
320. CTE to find the top driver per city by earnings. `[CTE]`
321. Use ROW_NUMBER() OVER(PARTITION BY rider_id) to find each rider's first trip. `[Window]`
322. Calculate 7-day rolling average of daily trips using AVG() OVER. `[Window]`
323. Use CTE to compute the daily trip completion rate for the last 30 days. `[CTE]`
324. Rank drivers by rating per vehicle type using RANK(). `[Window]`
325. Use LAG() to compute day-over-day change in city revenue. `[Window]`

---

### 2.5 Interview Scenarios

326. Find drivers who are consistently rated below 4.0 in their last 10 trips. `[Analytics]`
327. Identify riders who cancel more than 30% of their trip requests. `[Analytics]`
328. Calculate the platform's net revenue after driver payouts per month. `[Analytics]`
329. Find the most popular pickup-to-drop area pair (most frequent route). `[Analytics]`
330. Find drivers who had back-to-back trips with zero idle time. `[Analytics]`
331. Find the most efficient drivers by revenue earned per kilometre. `[Analytics]`
332. Find the top 5 earning drivers per vehicle type. `[GROUP BY]`
333. Find the day of week with the lowest cancellation rate. `[GROUP BY]`
334. List riders who referred others and the count of successful referrals. `[JOIN+GROUP]`
335. Calculate the average distance per trip by vehicle type. `[GROUP BY]`
336. Find drivers who received a 5-star rating on more than 80% of their trips. `[Analytics]`
337. Calculate the revenue per trip by surge zone. `[JOIN+GROUP]`
338. Find the longest trip by duration in each city. `[GROUP BY]`
339. List riders who only book trips late at night (11pm–4am). `[SELECT]`
340. Calculate the % of trips paid by cash vs. digital per city. `[GROUP BY]`
341. Find the average tip amount per trip by vehicle type. `[GROUP BY]`
342. Calculate the cancellation fee revenue per city per month. `[GROUP BY]`
343. Find the city with the highest driver-to-rider ratio. `[Analytics]`
344. Find the average rating given to drivers in each city. `[GROUP BY]`
345. Calculate the total earnings for each driver for the current month. `[GROUP BY]`
346. Find riders whose total spending is in the top 10% of all riders. `[Window]`
347. Calculate the % of trips that were surge-priced per city. `[Analytics]`
348. Find the most frequently paired driver-rider combination. `[GROUP BY]`
349. Calculate gross merchandise value (GMV) per vehicle type per quarter. `[GROUP BY]`
350. Find riders who used promo codes on every single trip. `[Subquery]`
351. Calculate the average wait time (request to driver accept) per area. `[Analytics]`
352. Find drivers who completed more than 10 trips in a single day. `[GROUP BY]`
353. Find the trip with the highest fare in each city for each month. `[Window]`
354. Find the % of night trips (10pm–6am) per driver. `[Analytics]`
355. Calculate the day each driver earned their highest income. `[Window]`
356. Find the city with the highest average trip fare. `[GROUP BY]`
357. Calculate the total promo discount given per city per month. `[JOIN+GROUP]`
358. Find drivers who have maintained a 4.5+ average rating. `[Subquery]`
359. List all drivers who completed their first trip within 24 hours of joining. `[Analytics]`
360. Find the average number of trips per rider per month. `[GROUP BY]`
361. List all riders who have spent more than ₹10,000 total on the platform. `[GROUP BY]`
362. Find the surge zone that generated the most additional revenue. `[JOIN+GROUP]`
363. Calculate the driver utilization rate (trips completed vs. available hours). `[Analytics]`
364. Find the most common cancellation reason per city. `[GROUP BY]`
365. List all drivers who have a penalty on any cancelled trip. `[JOIN]`
366. Calculate the average earnings per trip for each driver. `[GROUP BY]`
367. Find the month with the highest number of new rider signups. `[GROUP BY]`
368. List riders who have completed trips in more than 3 different cities. `[GROUP BY]`
369. Find the driver who earned the most from surge pricing. `[JOIN+GROUP]`
370. Calculate the platform's take rate (platform_cut / fare) per vehicle type. `[Analytics]`
371. Find riders who used the same promo code more than once. `[GROUP BY]`
372. List trips where the driver and rider are from the same city. `[JOIN]`
373. Calculate the revenue impact of cancellations (lost fare) per month. `[Analytics]`
374. Find all drivers who have driven for more than 1 year on the platform. `[SELECT]`
375. List the top 3 pickup areas by average fare per trip. `[GROUP BY]`
376. Find riders who signed up on the same day and made their first trip on the same day. `[Analytics]`
377. Calculate total driver earnings per city per quarter. `[GROUP BY]`
378. Find trips where the actual distance was significantly more than average for that route. `[Subquery]`
379. List all promo codes that have reached their usage limit. `[SELECT]`
380. Find the average trip count per driver per week. `[Analytics]`
381. Calculate the revenue contribution of each vehicle type as a % of total. `[Window]`
382. Find drivers who accepted trips outside their registered city. `[Analytics]`
383. List all riders whose last trip was more than 30 days ago. `[Analytics]`
384. Find the top 3 drivers by rider satisfaction score (average rating received). `[GROUP BY]`
385. Calculate the trip completion rate per driver. `[Analytics]`
386. Find all trips where surge was applied but fare was below the city average. `[Analytics]`
387. List all cities where the cancellation rate is above 20%. `[GROUP BY]`
388. Find riders who consistently give low ratings to drivers. `[Analytics]`
389. Calculate the average revenue per new driver in their first month. `[Analytics]`
390. Find the most popular drop-off zone for airport trips. `[GROUP BY]`
391. List all drivers who drove more than 300 km in a single day. `[Analytics]`
392. Find the peak day of month for trip requests. `[GROUP BY]`
393. Calculate the average fare per km by time of day. `[GROUP BY]`
394. Find all trips where rider and driver are in each other's ratings table. `[JOIN]`
395. List the top 5 cities by total revenue this quarter. `[GROUP BY]`
396. Find drivers who earned more from surge than non-surge trips. `[CTE]`
397. Calculate the year-over-year trip volume growth per city using CTE. `[CTE]`
398. Find the first trip ever completed on the platform. `[SELECT]`
399. List all riders with zero cancelled trips but 10+ total trips. `[Analytics]`
400. Find the average rating received by drivers from riders in each city. `[GROUP BY]`
401. Calculate the platform's net margin (platform_cut - operational cost proxy) per month. `[Analytics]`
402. Find riders who have referred more than 5 others successfully. `[GROUP BY]`
403. List drivers with an improving rating trend over their last 20 trips. `[Window]`
404. Find the route (pickup → drop) with the lowest average rider rating. `[GROUP BY]`
405. Calculate the monthly retention rate of active drivers. `[CTE]`

---

## 3. 🛵 Food & Package Delivery SQL

> **Schema:**
> ```
> customers(customer_id, name, phone, city, created_at)
> restaurants(restaurant_id, name, cuisine_type, city, area, rating, avg_prep_time_min, commission_pct)
> menu_items(item_id, restaurant_id, name, category, price, is_available, is_veg)
> delivery_orders(order_id, customer_id, restaurant_id, agent_id, order_time, accepted_time, pickup_time, delivered_time, status, total_amount, delivery_fee, discount)
> order_items(item_id, order_id, menu_item_id, quantity, unit_price)
> delivery_agents(agent_id, name, phone, city, vehicle_type, rating, status, joined_date)
> sla_breach(breach_id, order_id, promised_time_min, actual_time_min, breach_reason)
> delivery_zones(zone_id, city, area_name, base_delivery_fee, surge_active)
> ```

---

### 3.1 Basic Queries

406. List all active restaurants in a given city. `[SELECT]`
407. Find all veg menu items priced below ₹200. `[SELECT]`
408. Show all orders with 'delayed' status in the last 7 days. `[SELECT]`
409. List delivery agents currently available (status = 'active'). `[SELECT]`
410. Find all orders where a discount was applied. `[SELECT]`
411. List restaurants with an average rating above 4.2. `[SELECT]`
412. Find all orders paid via UPI. `[SELECT]`
413. Show all SLA breaches for a specific restaurant. `[SELECT]`
414. Find customers who ordered more than once today. `[GROUP BY]`
415. List all menu items that are currently unavailable. `[SELECT]`
416. Find all orders where delivery_fee was waived (delivery_fee = 0). `[SELECT]`
417. List restaurants that serve 'Italian' cuisine. `[SELECT]`
418. Find all agents with a rating below 3.0. `[SELECT]`
419. List all orders that are still in 'pending' status. `[SELECT]`
420. Find all menu items in the 'Desserts' category. `[SELECT]`

---

### 3.2 Aggregations

421. Calculate total revenue per restaurant per month. `[GROUP BY]`
422. Find the average delivery time per city. `[GROUP BY]`
423. Count orders per delivery agent and their average delivery time. `[GROUP BY]`
424. Find the top 5 most ordered menu items overall. `[GROUP BY]`
425. Calculate total SLA breaches per restaurant. `[GROUP BY]`
426. Find peak ordering hours across all restaurants. `[GROUP BY]`
427. Calculate total discount given per payment method. `[GROUP BY]`
428. Find restaurants with the highest average order value. `[GROUP BY]`
429. Count how many customers ordered from more than 3 different restaurants. `[GROUP BY]`
430. Find the average prep time per cuisine type. `[GROUP BY]`
431. Calculate total delivery fee revenue per city per month. `[GROUP BY]`
432. Count number of active menu items per restaurant. `[GROUP BY]`
433. Find restaurants with the most cancelled orders. `[GROUP BY]`
434. Calculate average order value per customer. `[GROUP BY]`
435. Find the city with the most SLA breaches. `[GROUP BY]`

---

### 3.3 JOINs

436. Show each order with customer name, restaurant name, and agent name. `[JOIN]`
437. List all orders with their individual items and prices. `[JOIN]`
438. Find restaurants that have had no orders in the last 30 days. `[LEFT JOIN]`
439. Show all SLA-breached orders with restaurant name and breach reason. `[JOIN]`
440. Find customers who have never used a discount. `[LEFT JOIN]`
441. Get each agent's most recent delivery with agent name. `[JOIN+Window]`
442. List all menu items with the count of how many times they've been ordered. `[JOIN+GROUP]`
443. Show restaurant reviews with customer name and restaurant name. `[JOIN]`
444. Find restaurants with commission owed to the platform this month. `[JOIN+Analytics]`
445. List all orders with total delivery time (order_time to delivered_time). `[JOIN]`
446. Find menu items that have never been ordered. `[LEFT JOIN]`
447. Show all agents with the count of SLA-breached orders assigned to them. `[JOIN+GROUP]`
448. List all orders with both restaurant name and delivery zone info. `[JOIN]`
449. Find customers who have ordered from the same restaurant 5+ times. `[JOIN+GROUP]`
450. Show the top 3 menu items per restaurant by order count. `[Window]`

---

### 3.4 CTEs & Window Functions

451. CTE to compute the on-time delivery rate per agent. `[CTE]`
452. Use ROW_NUMBER() to find each customer's most expensive order. `[Window]`
453. CTE to identify restaurants with SLA breach rate above 20%. `[CTE]`
454. Rank restaurants by revenue per city using DENSE_RANK(). `[Window]`
455. Use LAG() to find the delay between order placement and restaurant acceptance. `[Window]`
456. Identify top customers per city by order count using RANK(). `[Window]`
457. CTE to find agents with a declining rating over their last 10 deliveries. `[CTE]`
458. Calculate each restaurant's revenue as % of city total revenue using SUM() OVER(). `[Window]`
459. Use LEAD() to find downtime between agent deliveries. `[Window]`
460. CTE to find the top 3 restaurants per cuisine type by revenue. `[CTE]`
461. Use ROW_NUMBER() to deduplicate repeat order records. `[Window]`
462. Calculate the 7-day rolling average of daily orders per city. `[Window]`
463. CTE to find the month with the highest SLA breach count. `[CTE]`
464. Rank menu items by revenue within each restaurant using RANK(). `[Window]`
465. Use LAG() to identify restaurants with declining monthly revenue. `[Window]`

---

### 3.5 Interview Scenarios

466. Find customers with the highest repeat order rate from the same restaurant. `[Analytics]`
467. Calculate platform commission earned per city per month. `[Analytics]`
468. Find menu items with high order count but low restaurant rating. `[Analytics]`
469. Find agents who delivered to the same customer multiple times. `[GROUP BY]`
470. Calculate revenue lost due to cancelled orders per restaurant. `[Analytics]`
471. Find the optimal ordering window per city with maximum orders. `[GROUP BY]`
472. Calculate the % of orders delivered within the promised time per agent. `[Analytics]`
473. Find the most popular menu item per cuisine type. `[GROUP BY]`
474. List restaurants with an increasing trend in monthly orders. `[CTE+Window]`
475. Calculate the average number of items per order per restaurant. `[GROUP BY]`
476. Find restaurants that get the most reorders from the same customer. `[Analytics]`
477. List agents who have never had an SLA breach. `[LEFT JOIN]`
478. Find the cuisine type with the highest average order value. `[GROUP BY]`
479. Calculate the delivery fee as a % of total order value per city. `[Analytics]`
480. Find menu items that are frequently ordered as combos (appear together). `[JOIN]`
481. Calculate prep time accuracy per restaurant. `[Analytics]`
482. Find restaurants with all menu items priced above ₹300. `[Subquery]`
483. Calculate total orders per agent per time slot (morning/afternoon/night). `[CASE+GROUP]`
484. Find the cuisine type with the highest SLA breach count. `[JOIN+GROUP]`
485. List restaurants that attract primarily first-time customers. `[Analytics]`
486. Find the top 3 agents by customer satisfaction rating per city. `[Window]`
487. Calculate the average order value per cuisine type per city. `[GROUP BY]`
488. Find restaurants that received 5-star ratings within their first week. `[Analytics]`
489. Calculate the breakeven order value for free delivery per city. `[Analytics]`
490. List the most loyal customers per restaurant (ordered 10+ times). `[GROUP BY]`
491. Find the day of week with the most delivery SLA breaches. `[GROUP BY]`
492. Calculate the average number of restaurants a customer orders from per month. `[Analytics]`
493. Find the top 5 revenue-generating agents by city. `[GROUP BY]`
494. List all orders where delivery time exceeded 2× the promised time. `[SELECT]`
495. Calculate the platform's net revenue after agent payouts and restaurant commission. `[Analytics]`
496. Find restaurants that are consistently in the top 10 by city. `[Window]`
497. List customers who have ordered every cuisine type available in their city. `[Subquery]`
498. Find the menu item with the highest revenue per restaurant. `[Window]`
499. Calculate the monthly active restaurant count for the last 6 months. `[CTE]`
500. Find the agent who completed the most deliveries in a single day. `[GROUP BY]`
501. List all restaurants where the majority of orders are delivered with a discount. `[Analytics]`
502. Calculate the average discount per cuisine type. `[GROUP BY]`
503. Find all orders where agent GPS tracking stopped mid-delivery. `[Analytics]`
504. List restaurants that increased prices on more than 50% of menu items last month. `[Analytics]`
505. Find the restaurant with the fastest average prep time per cuisine type. `[GROUP BY]`
506. Calculate the % of orders delivered on time per delivery zone. `[Analytics]`
507. Find customers who consistently give 5-star ratings to agents. `[Analytics]`
508. List all orders with a total time under 20 minutes from placement to delivery. `[Analytics]`
509. Find the top 3 most ordered items on weekends vs. weekdays. `[CASE+Analytics]`
510. Calculate the cumulative delivery revenue per agent over time. `[Window]`
511. Find restaurants with the highest proportion of veg menu items. `[Analytics]`
512. List all cities where no restaurant has an average rating above 4.0. `[Subquery]`
513. Find the most common SLA breach reason per city. `[GROUP BY]`
514. Calculate the average delivery fee collected per order per city. `[GROUP BY]`
515. Find agents who completed deliveries in the shortest average time. `[GROUP BY]`
516. List all orders where the customer ordered within 10 minutes of the last order. `[Analytics]`
517. Find the restaurant with the widest price range in its menu. `[GROUP BY]`
518. Calculate total orders per customer per quarter. `[GROUP BY]`
519. Find the top 5 customers by total delivery fees paid. `[GROUP BY]`
520. List restaurants with a better weekend rating than weekday rating. `[CTE]`
521. Find all agents who joined in the last month and already have 50+ deliveries. `[SELECT]`
522. Calculate the platform revenue trend month over month using CTEs. `[CTE+Window]`
523. Find the top 3 restaurants per area by total orders. `[Window]`
524. List all customers who have a running streak of on-time deliveries. `[Analytics]`
525. Find the average time from order placement to agent assignment. `[Analytics]`
526. Calculate the SLA breach cost to the platform per restaurant. `[Analytics]`
527. Find restaurants whose rating went up by 0.5 points in the last 30 days. `[Analytics]`
528. List all menu items that have been available for more than 1 year without a price change. `[SELECT]`
529. Find the delivery zone with the highest average order value. `[JOIN+GROUP]`
530. Calculate the year-over-year growth in total orders per city. `[CTE]`
531. List agents ranked by total distance covered in a month. `[GROUP BY]`
532. Find orders where the restaurant did not accept within 5 minutes. `[Analytics]`
533. Calculate the % of orders where delivery_fee was the highest in the city. `[Window]`
534. Find the top restaurant per area by customer retention rate. `[Analytics]`
535. List all agents whose rating improved in the last 30 days. `[Analytics]`
536. Find customers who switched their most-ordered restaurant in the last 3 months. `[CTE]`
537. Calculate the average commission per cuisine type. `[GROUP BY]`
538. Find agents who worked in more than one delivery zone in a day. `[Analytics]`
539. List restaurants with zero SLA breaches for the entire last month. `[LEFT JOIN]`
540. Calculate the % of revenue coming from restaurants with rating > 4.5. `[Analytics]`

---

## 4. 💳 Payments & Fintech SQL

> **Schema:**
> ```
> users(user_id, name, email, phone, kyc_status, account_type, created_at)
> accounts(account_id, user_id, account_type, balance, currency, created_at, is_active)
> transactions(txn_id, from_account_id, to_account_id, amount, currency, txn_type, status, created_at, settled_at, reference_id, gateway_id)
> wallets(wallet_id, user_id, balance, currency, last_updated, is_frozen)
> payment_methods(pm_id, user_id, type, provider, masked_number, is_default, added_at, is_valid)
> refunds(refund_id, txn_id, amount, reason, status, initiated_at, completed_at)
> fraud_flags(flag_id, txn_id, flag_type, risk_score, flagged_at, reviewed_by, resolution)
> ledger_entries(entry_id, account_id, txn_id, entry_type, amount, balance_after, created_at)
> payouts(payout_id, merchant_id, amount, status, scheduled_at, paid_at)
> merchants(merchant_id, name, category, settlement_cycle_days, fee_pct, is_active)
> ```

---

### 4.1 Basic Queries

541. Find all failed transactions in the last 24 hours. `[SELECT]`
542. List all users with KYC status 'pending'. `[SELECT]`
543. Show all refunds initiated in the last 7 days. `[SELECT]`
544. Find all transactions with amount greater than ₹50,000. `[SELECT]`
545. List all active merchants in the 'retail' category. `[SELECT]`
546. Find all frozen wallets and their current balance. `[SELECT]`
547. Show all UPI transactions in the last 30 days. `[SELECT]`
548. List all payment methods added by users in the last month. `[SELECT]`
549. Find all payouts with status 'pending'. `[SELECT]`
550. List all transactions flagged for fraud. `[SELECT]`
551. Find all accounts with balance below ₹100. `[SELECT]`
552. List all users who have not made any transaction in 90 days. `[SELECT]`
553. Find all refunds with status 'completed'. `[SELECT]`
554. List all merchants that are currently inactive. `[SELECT]`
555. Find all transactions where from_account and to_account are in the same currency. `[SELECT]`

---

### 4.2 Aggregations

556. Calculate total transaction volume per day for the last 30 days. `[GROUP BY]`
557. Find total refunds issued per merchant per month. `[GROUP BY]`
558. Count successful vs. failed transactions per gateway. `[GROUP BY]`
559. Find the average transaction amount per currency. `[GROUP BY]`
560. Calculate total platform fee earned per merchant category. `[GROUP BY]`
561. Find merchants with the highest refund count. `[GROUP BY]`
562. Calculate total payout amounts per settlement cycle. `[GROUP BY]`
563. Find the most used payment method type by transaction count. `[GROUP BY]`
564. Find users with the highest total transaction value this month. `[GROUP BY]`
565. Calculate the number of transactions per hour of day. `[GROUP BY]`
566. Find the average number of transactions per user per month. `[GROUP BY]`
567. Calculate total revenue (fees earned) per merchant. `[GROUP BY]`
568. Find the payment method with the highest average transaction amount. `[GROUP BY]`
569. Count the number of fraud flags per flag type. `[GROUP BY]`
570. Calculate average refund processing time (initiated_at to completed_at). `[GROUP BY]`

---

### 4.3 JOINs

571. Show each transaction with sender name, receiver name, and amount. `[JOIN]`
572. List all fraud-flagged transactions with the user's name and email. `[JOIN]`
573. Show all refunds with original transaction details and merchant name. `[JOIN]`
574. Find merchants with pending payouts and their total outstanding amount. `[JOIN+GROUP]`
575. List all ledger entries with account holder name and balance. `[JOIN]`
576. Find users who have multiple payment methods but none set as default. `[LEFT JOIN]`
577. Show all high-risk transactions (risk_score > 0.8) with user details. `[JOIN]`
578. List payouts with bank account details for each merchant. `[JOIN]`
579. Find all users whose wallet balance does not match ledger sum. `[JOIN+Analytics]`
580. Show all refunded transactions with refund reason and merchant name. `[JOIN]`
581. List all transactions between users in the same city. `[JOIN]`
582. Find merchants who have never had a refund. `[LEFT JOIN]`
583. Show each user's total sent and received amounts. `[JOIN+GROUP]`
584. Find all failed transactions where a refund was still processed. `[JOIN]`
585. List all accounts with their associated payment methods. `[JOIN]`

---

### 4.4 CTEs & Window Functions

586. CTE to calculate rolling 3-day average transaction failure rate. `[CTE+Window]`
587. Use ROW_NUMBER() to get the latest transaction per user. `[Window]`
588. CTE to identify users with a sudden spike in transaction volume. `[CTE]`
589. Rank merchants by total settlement amount using DENSE_RANK(). `[Window]`
590. Use LAG() to compare each day's failed transactions with the previous day. `[Window]`
591. CTE to compute cumulative balance changes in the ledger per account. `[CTE+Window]`
592. Calculate each merchant's revenue contribution as % of total using SUM() OVER(). `[Window]`
593. Use LEAD() to find time between consecutive transactions per user. `[Window]`
594. CTE to find users who transact only during business hours. `[CTE]`
595. Use ROW_NUMBER() to identify the first transaction for each user. `[Window]`
596. Rank users by total spending per month using RANK(). `[Window]`
597. CTE to find merchants with consistently declining monthly revenue. `[CTE]`
598. Calculate the running total of payouts per merchant using SUM() OVER(). `[Window]`
599. Use NTILE(5) to segment users by transaction volume into 5 buckets. `[Window]`
600. CTE to find accounts with zero transactions in the last 60 days but positive balance. `[CTE]`

---

### 4.5 Interview Scenarios

601. Write a double-entry ledger validation: total debits must equal total credits per txn. `[Analytics]`
602. Detect velocity fraud: same user, more than 5 transactions within 10 minutes. `[Analytics]`
603. Calculate the exact settlement amount owed to each merchant after fees and refunds. `[Analytics]`
604. Find accounts whose balance went below zero at any point in the ledger history. `[Analytics]`
605. Calculate the refund rate per payment method type. `[GROUP BY]`
606. Find the top 10 merchants by gross transaction value this quarter. `[GROUP BY]`
607. Identify dormant accounts (no transactions in 180 days but positive balance). `[Analytics]`
608. Calculate the average settlement delay per merchant category. `[GROUP BY]`
609. Find all transactions with duplicate reference_ids (processing error check). `[Analytics]`
610. Calculate the average time to complete a refund per merchant category. `[GROUP BY]`
611. Find users who make transactions exclusively between midnight and 3am. `[Analytics]`
612. List merchants who have not received a payout in more than 14 days. `[SELECT]`
613. Find the most common failure reason for rejected transactions. `[GROUP BY]`
614. Calculate the total transaction volume per hour of day. `[GROUP BY]`
615. Find inactive wallets that still hold a balance above ₹100. `[SELECT]`
616. List payment methods with the highest failure rate. `[GROUP BY]`
617. Find accounts created on the same day as their first transaction. `[Analytics]`
618. Calculate the chargeback rate (refunds / total transactions) per gateway. `[GROUP BY]`
619. Find high-value transactions settled within 1 minute. `[SELECT]`
620. List all transactions processed by a now-deactivated gateway. `[JOIN]`
621. Calculate total platform revenue per transaction type per month. `[GROUP BY]`
622. Find all users with wallet balance inconsistent with the ledger total. `[Analytics]`
623. List merchants with the highest transaction success rate. `[GROUP BY]`
624. Calculate the P95 transaction amount per merchant category using PERCENTILE_CONT. `[Window]`
625. Find all UPI transactions above ₹1,00,000 (regulatory reporting). `[SELECT]`
626. List the top 10 merchants by unique customer count. `[GROUP BY]`
627. Find all refunds where the refund amount exceeds the original transaction. `[Analytics]`
628. Calculate the net balance change per account per week. `[CTE+Window]`
629. Find users who changed their default payment method more than twice. `[GROUP BY]`
630. Calculate the lifetime revenue from each merchant to the platform. `[GROUP BY]`
631. Find all accounts with only incoming transactions (never sent money). `[Subquery]`
632. List all transactions that took more than 5 minutes to settle. `[SELECT]`
633. Find the top 5 users by number of distinct merchants they transacted with. `[GROUP BY]`
634. Calculate the monthly active user count based on at least 1 transaction. `[GROUP BY]`
635. Find the average number of payment methods per active user. `[GROUP BY]`
636. List all users who completed KYC but made no transaction in 30 days. `[LEFT JOIN]`
637. Calculate the dispute resolution time per merchant. `[GROUP BY]`
638. Find all merchants with zero refunds in the last 6 months. `[LEFT JOIN]`
639. Calculate the average risk score of transactions per merchant category. `[GROUP BY]`
640. Find users who had 3 or more failed transactions before a successful one. `[Analytics]`
641. List all accounts where balance changed by more than 50% in a single transaction. `[Analytics]`
642. Find the day of week with the most fraud flags. `[GROUP BY]`
643. Calculate the cumulative payout per merchant over 6 months. `[Window]`
644. Find all merchants with both the highest fee and highest refund rate. `[Analytics]`
645. List the top 3 payment methods by total transaction value per city. `[GROUP BY]`
646. Calculate the average transaction amount by account_type. `[GROUP BY]`
647. Find all users who have transacted in more than one currency. `[GROUP BY]`
648. Calculate the total number of active payment methods per user. `[GROUP BY]`
649. Find the month with the highest fraud flag count. `[GROUP BY]`
650. Calculate the average monthly spend per user for the last 3 months. `[CTE]`
651. Find all accounts that were active last month but inactive this month. `[CTE]`
652. List all merchants sorted by their settlement cycle in ascending order. `[SELECT]`
653. Find users who transacted on every single day of last month. `[Analytics]`
654. Calculate the average number of retried transactions per day. `[Analytics]`
655. Find the top 5 most transacted-with merchants by unique users. `[GROUP BY]`
656. List all wallets that have been frozen for more than 30 days. `[SELECT]`
657. Calculate revenue concentration: % of revenue from top 10 merchants. `[Window]`
658. Find all users with more incoming than outgoing transactions this month. `[Analytics]`
659. List all transactions where the fee was 0 (fee waiver cases). `[SELECT]`
660. Find the average balance per account_type. `[GROUP BY]`
661. Calculate the monthly new user activation rate (KYC done + first transaction). `[CTE]`
662. Find the most popular transaction type by volume and by value. `[GROUP BY]`
663. List all merchants with a pending payout older than their settlement cycle. `[Analytics]`
664. Calculate the total amount in frozen wallets per currency. `[GROUP BY]`
665. Find all refunds that took more than 7 days to complete. `[SELECT]`
666. List the top 3 users by number of distinct payment methods used. `[GROUP BY]`
667. Calculate the transaction success rate per gateway per month. `[GROUP BY]`
668. Find all transactions where the amount is exactly equal to the account balance. `[Analytics]`
669. List all users who made their first transaction within 1 hour of registration. `[Analytics]`
670. Calculate the average payout amount per merchant per month. `[GROUP BY]`
671. Find merchants whose fee_pct is above the platform average. `[Subquery]`
672. List the top 5 users by net money received (total in - total out). `[Analytics]`
673. Find the most common txn_type for high-value transactions (> ₹1,00,000). `[GROUP BY]`
674. Calculate the total refund amount processed per week for the last month. `[GROUP BY]`
675. Find all users who have never had a failed transaction. `[LEFT JOIN]`

---

## 5. 👥 HR & Employee SQL

> **Schema:**
> ```
> employees(emp_id, name, email, department_id, manager_id, hire_date, salary, job_title, city, status)
> departments(dept_id, name, location, budget, manager_id)
> salaries(salary_id, emp_id, amount, effective_date, salary_type)
> performance_reviews(review_id, emp_id, reviewer_id, rating, review_date, comments)
> leaves(leave_id, emp_id, leave_type, start_date, end_date, status, approved_by)
> trainings(training_id, emp_id, course_name, completed_date, score, certification)
> projects(project_id, name, start_date, end_date, budget, status)
> project_assignments(assignment_id, project_id, emp_id, role, assigned_date, hours_allocated)
> ```

---

### 5.1 Classic Must-Know HR Questions

676. Find the second highest salary among all employees. `[Subquery]`
677. List all employees who earn more than their manager's salary. `[SELF JOIN]`
678. Find all departments with no employees assigned. `[LEFT JOIN]`
679. List all employees with their manager's name using a self join. `[SELF JOIN]`
680. Find employees who have never taken a leave. `[LEFT JOIN]`
681. Get the department with the highest average salary. `[GROUP BY]`
682. Find employees earning above the average salary of their own department. `[Subquery]`
683. List all managers who directly manage more than 5 employees. `[GROUP BY]`
684. Find the Nth highest salary — write it for N = 3. `[Subquery]`
685. Find employees who joined in the same year as their manager. `[SELF JOIN]`
686. List employees with no performance reviews in the last 12 months. `[LEFT JOIN]`
687. Find departments where every employee's salary is above ₹50,000. `[Subquery]`
688. List all employees with the same salary as at least one other employee. `[Subquery]`
689. Find the department with the most employees. `[GROUP BY]`
690. List all employees who report to the same manager as a given employee (peers). `[SELF JOIN]`

---

### 5.2 Aggregations & Analytics

691. Calculate total payroll cost per department. `[GROUP BY]`
692. Find the top 3 earners in each department using DENSE_RANK(). `[Window]`
693. Calculate year-over-year salary growth per employee using LAG(). `[Window]`
694. Find employees who took more than 10 days of leave this year. `[GROUP BY]`
695. Identify employees assigned to more than 2 active projects simultaneously. `[GROUP BY]`
696. Write a recursive CTE to display the full management hierarchy. `[Recursive CTE]`
697. Calculate the department budget utilization rate (payroll / budget). `[Analytics]`
698. Find the project with the highest number of assigned employees. `[GROUP BY]`
699. Compute the average training score per department. `[GROUP BY]`
700. Find the median salary per job title using PERCENTILE_CONT. `[Window]`
701. Find employees due for a review (no review in the last 6 months). `[Subquery]`
702. List all projects that are currently over budget. `[SELECT]`
703. Calculate the total hours allocated per project. `[GROUP BY]`
704. Find employees whose salary is in the top 10% company-wide. `[Window]`
705. List all employees who have completed every available training course. `[Subquery]`
706. Find the manager with the highest average team performance rating. `[JOIN+GROUP]`
707. Calculate the salary percentile for each employee within their department. `[Window]`
708. Find departments with the largest salary spread (max - min salary). `[GROUP BY]`
709. List all employees who have been with the company for more than 5 years. `[SELECT]`
710. Calculate the average headcount per department per quarter. `[Analytics]`
711. Find employees who have never been assigned to any project. `[LEFT JOIN]`
712. List all employees with a performance rating below 2 in the last review. `[JOIN]`
713. Find the employee who worked on the most unique projects. `[GROUP BY]`
714. Calculate the total leave days taken per department per year. `[GROUP BY]`
715. Find employees earning less than any employee in the Engineering department. `[Subquery]`
716. List the top 5 performers per department by their average review rating. `[Window]`
717. Find all employees who took maternity or paternity leave this year. `[SELECT]`
718. Calculate total training cost per department (assume fixed cost per course). `[Analytics]`
719. Find the longest-serving employee in each department. `[Window]`
720. List all employees who changed their job title in the last year. `[Analytics]`
721. Calculate the span of control per manager (number of direct reports). `[GROUP BY]`
722. Find employees who have a salary higher than any employee in the HR department. `[Subquery]`
723. List all employees who received a perfect performance rating (5.0) in the last review. `[JOIN]`
724. Calculate the average time-to-hire per department (job posted to hire_date). `[Analytics]`
725. Find projects with only 1 assigned employee. `[GROUP BY]`
726. List all employees whose training score is below the department average. `[Subquery]`
727. Find the top 3 job titles by average salary. `[GROUP BY]`
728. Calculate the annual bonus estimate (salary × rating/5 × 0.1) for each employee. `[Analytics]`
729. Find all employees who submitted a leave request on their hire anniversary. `[Analytics]`
730. List departments where the manager's salary is below the department average. `[Subquery]`
731. Find employees who share the same hire date. `[GROUP BY]`
732. Calculate the average number of projects per employee. `[Analytics]`
733. Find all employees currently on leave (leave_start <= today <= leave_end). `[SELECT]`
734. List all employees with no manager (top-level executives). `[SELECT]`
735. Calculate the total sick leave days used per employee this year. `[GROUP BY]`
736. Find employees who got a raise in the last salary update. `[LAG]`
737. List all projects ending in the next 30 days that are still in progress. `[SELECT]`
738. Find the department with the best average training score. `[GROUP BY]`
739. List all employees who took leave immediately after joining (within 30 days). `[Analytics]`
740. Calculate the effective hourly rate for each employee based on hours allocated. `[Analytics]`
741. Find all job titles where the average salary is below ₹40,000. `[GROUP BY]`
742. List employees who have both the most projects and the highest rating. `[Analytics]`
743. Calculate the turnover rate per department (if resigned_date column exists). `[Analytics]`
744. Find the most common leave type per department. `[GROUP BY]`
745. List all employees whose salary was not updated in the last 2 years. `[SELECT]`
746. Find departments where training completion rate is above 80%. `[Analytics]`
747. Calculate the average review rating per year per department. `[GROUP BY]`
748. Find all employees who have both a project assignment and an active leave. `[JOIN]`
749. List managers who approved more than 20 leave requests this year. `[GROUP BY]`
750. Find the employee with the widest salary gap compared to their department average. `[Subquery]`
751. Calculate the total number of training hours per employee. `[GROUP BY]`
752. Find all employees with a higher salary than the company average but a lower rating than the company average. `[Subquery]`
753. List all employees who completed a certification course. `[SELECT]`
754. Find the department that hired the most employees last year. `[GROUP BY]`
755. Calculate the average tenure (years) of employees per job title. `[GROUP BY]`
756. Find all employees with more leave days pending than used. `[Analytics]`
757. List the top 3 cities with the most employees. `[GROUP BY]`

---

## 6. 📱 Social Media SQL

> **Schema:**
> ```
> users(user_id, username, email, city, created_at, follower_count, following_count)
> posts(post_id, user_id, content, media_type, created_at, likes_count, comments_count, shares_count)
> likes(like_id, post_id, user_id, liked_at)
> comments(comment_id, post_id, user_id, content, created_at, parent_comment_id)
> follows(follow_id, follower_id, following_id, followed_at)
> hashtags(hashtag_id, tag_name)
> post_hashtags(post_id, hashtag_id)
> messages(msg_id, sender_id, receiver_id, content, sent_at, read_at)
> ad_impressions(impression_id, user_id, ad_id, shown_at, clicked, converted)
> ```

---

### 6.1 Core Social Queries

758. Find the top 10 posts by likes count in the last 7 days. `[SELECT]`
759. List all users who follow each other (mutual follows). `[SELF JOIN]`
760. Find users who liked a post but don't follow the post's author. `[JOIN]`
761. Calculate total engagement (likes + comments + shares) per post. `[SELECT]`
762. Find the most used hashtag this week. `[GROUP BY]`
763. List users with more followers than accounts they follow. `[SELECT]`
764. Calculate daily active users (DAU) for the last 30 days. `[GROUP BY]`
765. Find the top 5 users by total post engagement this month. `[GROUP BY]`
766. Find posts that got more than 1000 likes within 24 hours of posting. `[Analytics]`
767. Calculate the ad click-through rate (CTR) per user segment. `[Analytics]`
768. Find the average number of posts per user per month. `[GROUP BY]`
769. List all users who have never posted anything. `[LEFT JOIN]`
770. Find the most commented post in the last 30 days. `[GROUP BY]`
771. Calculate the follower-to-following ratio per user. `[SELECT]`
772. Find users who have been following an account for more than 1 year. `[SELECT]`
773. List the top 5 hashtags by number of posts. `[GROUP BY]`
774. Find users who liked every post from a specific user this month. `[Subquery]`
775. Calculate the average time between when a post is published and when it gets its first like. `[Analytics]`
776. Find users who unfollowed more than 5 accounts in the last 7 days. `[Analytics]`
777. List all posts with more shares than likes. `[SELECT]`
778. Find the most active hour of day for post creation. `[GROUP BY]`
779. Calculate the ad conversion rate per city. `[GROUP BY]`
780. Find users who have followers but have never posted. `[LEFT JOIN]`
781. List the top 5 content creators by average likes per post. `[GROUP BY]`
782. Calculate the average message thread length per user pair. `[Analytics]`
783. Find the most replied-to comment in the platform's history. `[GROUP BY]`
784. List accounts that were created and immediately followed 50+ accounts (potential bots). `[Analytics]`
785. Find the best day of week for maximum engagement per user. `[GROUP BY]`
786. Calculate the % of messages read within 5 minutes. `[Analytics]`
787. Find all users who posted every day for the last 7 days. `[Analytics]`
788. List hashtags used in 100+ posts this month. `[GROUP BY]`
789. Find the top 3 users by follower growth in the last 30 days. `[Analytics]`
790. Calculate the share of voice (% of total posts) per hashtag. `[Window]`
791. Find posts that received more than 5 comments from the same user. `[GROUP BY]`
792. List users who posted the same content (duplicate posts) in the same week. `[Analytics]`
793. Find the top 5 users by total likes received across all posts. `[GROUP BY]`
794. Calculate the weekly retention rate of active users. `[CTE]`
795. Find all users who have liked more posts than they've created. `[Analytics]`
796. List the top 3 cities by average engagement rate per post. `[GROUP BY]`
797. Find posts that trended (sudden spike in likes compared to the user's average). `[Analytics]`
798. Calculate the unread message rate per user. `[Analytics]`
799. Find the most popular media type (photo/video/text) by likes. `[GROUP BY]`
800. Find the average follower count per city. `[GROUP BY]`
801. List users who have never liked any post. `[LEFT JOIN]`
802. Find the top 5 hashtags by engagement rate (likes + comments per post using that tag). `[Analytics]`
803. Calculate the correlation between posting frequency and follower count. `[Analytics]`
804. Find users whose follower_count in the users table doesn't match the count in the follows table. `[Analytics]`
805. List all posts that were deleted within 24 hours of posting. `[Analytics]`
806. Find the % of ad impressions that led to a conversion. `[Analytics]`
807. Calculate the average number of hashtags per post per user. `[GROUP BY]`
808. Find users who commented on a post but did not like it. `[JOIN]`
809. List accounts with the highest engagement rate (likes+comments / followers). `[Analytics]`

---

## 7. 📚 Core SQL Concepts

> **Focus:** Concept-based questions applicable across all schemas.

---

### 7.1 NULL Handling

810. Write a query using COALESCE to replace NULL delivery times with the average delivery time. `[NULL]`
811. Use NULLIF to avoid division-by-zero when calculating the order conversion rate. `[NULL]`
812. Find all rows where a column is NULL vs. an empty string — how do you differentiate? `[NULL]`
813. Find all employees with NULL manager_id (top-level managers). `[NULL]`
814. Use COALESCE to return the first non-null value from phone, email, or user_id as a contact identifier. `[NULL]`
815. Find all transactions where the settled_at timestamp is NULL (still pending). `[NULL]`

---

### 7.2 CASE Statements

816. Write a CASE to classify customers as 'High', 'Medium', or 'Low' spenders based on total spend. `[CASE]`
817. Use CASE inside COUNT to count only delivered orders without a WHERE clause. `[CASE]`
818. Write a CASE to label trip duration as 'Short' (<10 min), 'Medium' (10–30), or 'Long' (>30). `[CASE]`
819. Create a histogram of order values using CASE: ₹0–500, ₹500–2000, ₹2000+. `[CASE]`
820. Use CASE to convert a numeric rating (1–5) to text: 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'. `[CASE]`
821. Write a CASE to flag transactions as 'Domestic' or 'International' based on currency. `[CASE]`
822. Use CASE to classify employees as 'Junior', 'Mid', or 'Senior' based on salary. `[CASE]`
823. Write a query to pivot monthly sales into columns (Jan, Feb, Mar) using CASE + SUM. `[CASE+Pivot]`

---

### 7.3 String Functions

824. Extract the domain name from email addresses using SUBSTRING and POSITION. `[String]`
825. Concatenate first_name and last_name with a space in between. `[String]`
826. Find all products whose name starts with 'Pro' using LIKE. `[String]`
827. Convert all customer email addresses to lowercase. `[String]`
828. Use TRIM to clean leading/trailing whitespace from city names. `[String]`
829. Find all phone numbers that do not follow the format +91XXXXXXXXXX using LIKE or REGEXP. `[String]`
830. Use STRING_AGG to create a comma-separated list of product names per order. `[String]`
831. Replace all occurrences of 'Old Brand' with 'New Brand' in product names using REPLACE. `[String]`
832. Find the length of each product description and sort by longest. `[String]`
833. Mask the last 4 digits of a credit card number stored as text. `[String]`

---

### 7.4 Date & Time Functions

834. Find all orders placed in the current month. `[Date]`
835. Calculate the number of days between order_date and delivered_date. `[Date]`
836. Extract the day of the week for each transaction. `[Date]`
837. Calculate the age of each account in years from created_at to today. `[Date]`
838. Find all transactions that occurred on weekends. `[Date]`
839. Truncate timestamps to the hour level for hourly aggregation. `[Date]`
840. Find all records created in the first week of each month. `[Date]`
841. Calculate the number of business days between two dates (excluding weekends). `[Date]`
842. Find the first and last day of the previous month dynamically. `[Date]`
843. Use DATE_TRUNC to group revenue by week. `[Date]`

---

### 7.5 Set Operations

844. Use UNION to combine customer lists from two regional tables into one. `[Set]`
845. Use INTERSECT to find customers who placed both online and offline orders. `[Set]`
846. Use EXCEPT to find products that are in the catalog but have never been ordered. `[Set]`
847. Explain the difference between UNION and UNION ALL — write an example query. `[Set]`
848. Use UNION ALL then deduplicate with ROW_NUMBER() to merge two customer tables. `[Set]`
849. Use INTERSECT to find drivers who are also registered as riders. `[Set]`
850. Use EXCEPT to find menu items available last month but removed this month. `[Set]`

---

### 7.6 Indexes & Performance Theory

851. When would a full table scan be faster than using an index? (Answer + example). `[Theory]`
852. What is a composite index? Write a query that benefits from one. `[Theory]`
853. Explain the difference between a clustered and non-clustered index. `[Theory]`
854. How does EXPLAIN ANALYZE help optimize a slow JOIN query? `[Theory]`
855. When should you use a partial index? Give a practical example. `[Theory]`
856. What is index selectivity and why does it matter for query performance? `[Theory]`
857. Write a query using EXISTS instead of IN and explain when EXISTS is faster. `[Performance]`
858. How does a covering index work? Write an example query that benefits from one. `[Theory]`
859. Use keyset pagination instead of OFFSET to paginate large result sets efficiently. `[Performance]`
860. Write a query to efficiently count rows in a large table without a full scan. `[Performance]`

---

### 7.7 Transactions & ACID

861. Explain dirty read, non-repeatable read, and phantom read with a SQL example each. `[Theory]`
862. Write a SQL transaction that transfers money safely between two accounts. `[Transaction]`
863. What isolation level prevents phantom reads? Give an example of when you need it. `[Theory]`
864. Explain the difference between COMMIT and ROLLBACK with a real-world example. `[Theory]`
865. Write a query using SELECT FOR UPDATE to prevent double-booking of a seat. `[Transaction]`
866. What is a deadlock? How do you detect and prevent it in PostgreSQL? `[Theory]`
867. Explain SAVEPOINT and when to use it in a complex transaction. `[Transaction]`
868. What is the difference between READ COMMITTED and REPEATABLE READ? `[Theory]`
869. Write a transaction that inserts an order and deducts stock atomically. `[Transaction]`
870. Explain two-phase locking with a simple SQL example. `[Theory]`

---

### 7.8 Advanced SQL Patterns

871. Use ARRAY_AGG to collect all ordered product names per order into one row. `[Advanced]`
872. Write a query using JSON_AGG to return order details as a JSON object. `[Advanced]`
873. Use GENERATE_SERIES to create a complete list of dates for the last 30 days. `[Advanced]`
874. Use a LATERAL JOIN to get the last 3 orders for each customer. `[Advanced]`
875. Write a query to detect gaps in sequential order IDs (missing IDs). `[Advanced]`
876. Use GROUPING SETS to produce revenue breakdowns at the category and city level. `[Advanced]`
877. Use ROLLUP to generate subtotals and a grand total in a sales report. `[Advanced]`
878. Write a query to merge overlapping session time ranges into consolidated blocks. `[Advanced]`
879. Use a FILTER clause inside an aggregate instead of a CASE expression. `[Advanced]`
880. Use STRING_AGG with ORDER BY to create an ordered list of products per order. `[Advanced]`
881. Write a query to find all circular references in a hierarchical employees table. `[Recursive CTE]`
882. Use CROSS JOIN to create a date × product combination for a sales forecast template. `[Advanced]`
883. Write a query using VALUES clause to inline a small lookup table. `[Advanced]`
884. Use DISTINCT ON (PostgreSQL) to get the latest record per group. `[Advanced]`
885. Write a query to compute a running mode (most frequent value so far) using window functions. `[Window]`
886. Use CTEs to find the shortest dependency chain between two tasks in a project. `[Recursive CTE]`
887. Write a query to detect and report all orphaned records (missing FK reference). `[Advanced]`
888. Use JSONB operators in PostgreSQL to query nested fields in a JSON column. `[Advanced]`
889. Write a query using WINDOW FUNCTION to detect sudden spikes in daily counts. `[Window]`
890. Write a query to calculate a cumulative moving sum that resets at the start of each month. `[Window]`
891. Use ROW_NUMBER() + DELETE to remove duplicate rows keeping only the latest per key. `[Advanced]`
892. Write a gaps-and-islands query to find consecutive login streaks per user. `[Window]`
893. Use TABLESAMPLE BERNOULLI(10) to sample 10% of a large table for analysis. `[Advanced]`
894. Write a query to count rows added in the last 24 hours per table (using information_schema). `[Advanced]`
895. Use a CTE + INSERT to upsert (insert or update) records into a target table. `[Advanced]`
896. Write a query to compute a Fibonacci sequence using a recursive CTE. `[Recursive CTE]`
897. Use WINDOW FUNCTION RANGE BETWEEN to compute a sum of the current and previous rows. `[Window]`
898. Write a query to find the top-N records per group without using RANK() or ROW_NUMBER(). `[Subquery]`
899. Use EXPLAIN to compare a query with and without an index and interpret the output. `[Performance]`
900. Write a query to validate that all foreign key constraints are satisfied in a given schema. `[Advanced]`

---

## 💡 Quick Reference: SQL Concept Index

| Concept | Question Numbers |
|---|---|
| Basic SELECT | 1–20, 266–280, 406–420, 541–555 |
| GROUP BY / HAVING | 21–40, 281–295, 421–435, 556–570 |
| INNER JOIN | 41–55, 296–310, 436–450, 571–585 |
| LEFT JOIN (find missing) | 56–65, 297, 438–440, 636 |
| Subqueries | 66–80, 683–688 |
| CTEs | 81–95, 311–325, 451–465, 586–600 |
| Window Functions | 96–115, 312–325, 454–465, 587–599 |
| Self JOIN | 676–685, 759 |
| Recursive CTE | 696, 881, 886, 896 |
| CASE Statements | 816–823 |
| NULL Handling | 810–815 |
| String Functions | 824–833 |
| Date Functions | 834–843 |
| Set Operations | 844–850 |
| Transactions | 861–870 |
| Indexes / Performance | 851–860, 899 |
| Advanced Patterns | 871–900 |

---

## 🎯 Interview Study Plan

| Week | Focus | Questions |
|---|---|---|
| Week 1 | SELECT, WHERE, ORDER BY, LIMIT | 1–40, 266–295 |
| Week 2 | JOINs (INNER + LEFT) | 41–65, 296–315 |
| Week 3 | GROUP BY, HAVING, Subqueries | 21–40, 66–80, 421–435 |
| Week 4 | CTEs + Window Functions | 81–115, 311–325 |
| Week 5 | HR Classics + Self JOINs | 676–757 |
| Week 6 | E-Commerce + Payments scenarios | 111–265, 601–675 |
| Week 7 | Analytics across all domains | 326–405, 466–540 |
| Week 8 | Core Concepts + Advanced Patterns | 810–900 |

---

*900 questions | 7 domains | Easy & Medium difficulty | Interview-optimized*
