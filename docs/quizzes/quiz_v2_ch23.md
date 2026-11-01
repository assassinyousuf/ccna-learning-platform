# Assessment & Review: Volume 2 Chapter 23 - Chapter 23: REST APIs

### Question 1: Which HTTP method is generally equivalent to a CRUD “create” operation?
- A. PUT
- B. PATCH
- C. POST
- D. GET

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: The HTTP POST method is generally equivalent to a CRUD “create” operation. It is used to create a new resource on the server.


---

### Question 2: Which HTTP methods are generally equivalent to a CRUD “update” operation? (select two)
- A. PUT
- B. PATCH
- C. POST
- D. GET

> **Official Correct Answer**: **B** — B: PATCH  
> **Technical Explanation**: The HTTP PUT and PATCH methods are generally equivalent to a CRUD “update” operation. PUT is used to replace a resource, and PATCH is used to modify a resource.


---

### Question 3: Which HTTP method is used to replace the specified resource?
- A. PUT
- B. PATCH
- C. POST
- D. GET

> **Official Correct Answer**: **A** — A: PUT  
> **Technical Explanation**: The PUT HTTP method is generally used to replace the specified resource entirely. If the specified resource does not exist, it may be created using PUT.


---

### Question 4: Which HTTP response code indicates that the request resource was not found?
- A. 200
- B. 201
- C. 403
- D. 404

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: The 404 “Not Found” HTTP response code indicates that the requested resource was not found on the server. 5. Which of the following HTTP response code classes are correct? (select three) A: 2xx = successful D: 1xx = informational E: 3xx = redirection 1xx codes are informational, 2xx codes indicate successful responses, and 3xx codes indicate that further action needs to be taken to complete the request. The remaining classes are 4xx for client errors and 5xx for server errors.


---

### Question 5: Which of the following HTTP response code classes are correct? (select three)
- A. 2xx = successful
- B. 4xx = server error
- C. 5xx = client error
- D. 1xx = informational
- E. 3xx = redirection

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Official answer: . Review the chapter concepts to master this exam topic.


---

### Question 6: Which of the following statements about REST APIs are true? (select two)
- A. REST APIs are stateful.
- B. REST APIs are stateless.
- C. REST uses a client-server architecture.
- D. REST uses a peer-to-peer architecture.

> **Official Correct Answer**: **B** — B: REST APIs are stateless.  
> **Technical Explanation**: C: REST uses a client-server architecture. REST APIs are stateless, meaning that each request is a separate event, independent of all past exchanges between the client and server. Each request from the client must contain all the information needed to understand and process the request. REST is based on a client-server architecture in which the client and server are independent of each other.


---

### Question 7: Which statement about caching is accurate with regard to REST APIs?
- A. Resources must be marked as cacheable or non-cacheable.
- B. Resources are never cacheable.
- C. Resources must be cacheable.

> **Official Correct Answer**: **A** — A: Resources must be marked as cacheable or non-cacheable.  
> **Technical Explanation**: In REST APIs, resources can be cacheable or non-cacheable, but they must be explicitly or implicitly marked as such.


---

### Question 8: Which of the following HTTP response codes indicates a successful request?
- A. 102
- B. 200
- C. 301
- D. 500

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## B: 200 The 200 “OK” HTTP response code indicates a successful request. This response code is commonly used to indicate that a GET, PUT, POST, or PATCH request was successfully processed.


---

### Question 9: Which REST API authentication method allows a client to access a resource on a server on behalf of the resource’s owner?
- A. OAuth 2.0
- B. Basic authentication
- C. API key authentication
- D. Bearer authentication

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## A: OAuth 2.0 OAuth 2.0 is designed to allow third-party applications to access resources on behalf of the resource owner without sharing the owner’s credentials. The resource owner grants authorization to the third-party client application, which uses the authorization grant to obtain an access token. This token allows the client to access the resource on behalf of the owner.


---

### Question 10: In which REST API authentication method does a client authenticate with an authorization server to receive a token that the client includes in its API calls?
- A. OAuth 2.0
- B. Basic authentication
- C. API key authentication
- D. Bearer authentication

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## D: Bearer authentication In bearer authentication, the client authenticates with an authorization server to obtain an access token, which it includes in its API calls to access protected resources. The access token is typically short-lived, requiring regular renewal for continued access.


---

### Question 11: What is the primary advantage of using OAuth 2.0 for accessing resources?
- A. OAuth 2.0 requires no client-side implementation.
- B. OAuth 2.0 allows third-party applications to access resources without sharing the user’s credentials.
- C. OAuth 2.0 tokens do not expire.
- D. OAuth 2.0 is easier to implement than basic authentication.

> **Official Correct Answer**: **B** — B: OAuth 2.0 allows third-party applications to access resources without sharing the user’s credentials.  
> **Technical Explanation**: OAuth 2.0 provides a secure way to delegate access to resources by issuing tokens, thereby eliminating the need to share the user’s credentials with third-party applications. OAuth 2.0 is a key component of many modern web applications.

