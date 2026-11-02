# Assessment & Review: Volume 2 Chapter 24 - Chapter 24: Data formats

### Question 1: In which data serialization language is whitespace significant?
- A. XML
- B. YAML
- C. JSON

> **Official Correct Answer**: **B** — B: YAML  
> **Technical Explanation**: In YAML (YAML Ain’t Markup Language), whitespace (specifically, indentation) is significant and is used to denote structure of the data. In XML (Extensible Markup Language) and JSON (JavaScript Object Notation), whitespace is not significant for the structure of the data.


---

### Question 2: Which data serialization language uses HTML-like tags?
- A. XML
- B. YAML
- C. JSON

> **Official Correct Answer**: **A** — A: XML  
> **Technical Explanation**: XML uses HTML-like tags to indicate key-value pairs: &lt;key&gt;value&lt;/key&gt; .


---

### Question 3: What is the JSON name for an unordered set of key-value pairs?
- A. Array
- B. List
- C. Item
- D. Object

> **Official Correct Answer**: **D** — D: Object  
> **Technical Explanation**: In JSON, an unordered set of key-value pairs is known as an “object”. It is enclosed in curly braces, with keys and values separated by colons.


---

### Question 4: Which statements are true about the following JSON data? (select two) {"interface\_name":"GigabitEthernet1/1","is\_up":"true","speed":1000}
- A. The value of “is\_up” is a JSON boolean.
- B. The value of “speed” is a JSON number.
- C. The data is a JSON object.
- D. The data is a JSON array.

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: The value of "speed" is a numeric value that is not enclosed in double quotes, so it is a JSON number. The data as a whole is a JSON object—a set of key-value pairs enclosed in curly braces.


---

### Question 5: Which of the following statements about JSON arrays are true? (select two) A: Arrays are enclosed in square brackets. C: The values don’t have to be of the same data type.
- 
- Option B
- Option C
- Option D

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: A JSON array is an ordered set of values enclosed in square brackets. The values can be of any valid JSON data type (including another array), but don’t all have to be of the same data type. The values are separated by commas, but there must not be a trailing comma.


---

### Question 6: Which of the following statements about JSON objects are true? (select two)
- A. The key of each key-value pair must be a string.
- B. The value of each key-value pair can be any valid JSON data type except another object.
- C. There must not be a trailing comma.
- D. Objects are enclosed in square brackets.

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: A JSON object is an unordered set of key-value pairs enclosed in curly braces. The key of each pair must be a string, and the value can be any valid JSON data type (including another object). The key and value of each pair are separated by a colon, and each pair is separated by a comma, but there must not be a trailing comma.


---

### Question 7: Which statement about the following JSON data is true? {"device":"Switch01","location":"DataCenterA","uptime":"72 hours","ports\_active":24}
- A. It is valid JSON data.
- B. A comma is missing.
- C. The whitespace formatting is invalid.
- D. There is an extra colon.

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: There are no missing commas, extra colons, or any other elements that would make this data invalid; it is valid JSON data.


---

### Question 8: Which of the following are valid JSON strings? (select all that apply)
- A. 'Hello.'
- B. "Acing The CCNA Exam"
- C. "true"
- D. True or false
- E. "1000"
- F. null

> **Official Correct Answer**: **B** — B: "Acing The CCNA Exam"  
> **Technical Explanation**: C: "true" A JSON string is an alphanumeric text value enclosed in double quotes. This applies to values that would otherwise be of a different data type without quotes: "true" would be a JSON boolean without double quotes, and "1000" would be a JSON number. E: "1000"

