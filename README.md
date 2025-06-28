# handy scrips I wrote for IUST

## Demo
here is a working demo that might interest you.
<video src="https://github.com/user-attachments/assets/380c3699-b078-4a38-b2dd-04e88d45f5cd"></video>

## Requirements

- Node.js version 23 or higher

## Installation

1.  Install pnpm & tsx globally:

    ```bash
    npm install -g pnpm tsx
    ```
2.  Install dependencies using pnpm:

    ```bash
    pnpm install
    ```

## Running Tests

To run the tests, use the following command:

```bash
pnpm run test
```

## Usage

Make a `.env` file in the root of this folder and set your cookie there.
```txt
COOKIE = "..."
```
see [how to get cookie](#how-to-get-cookie)


```bash
pnpm run legendaryWork
```


# Documentation
When running the script will do the following for now.

## Send Lectures Acknowledgement feedback form
- It gets all the courses you are enrolled in for your current session.
- It gets all the topics for each particular course
- For each topic of a course, it sends the feedback with the following defaults:
  - Lecture duration: 60 mins
  - Lecture taught: yes
  - Rating: 5 star
  - Comment: Excellent Lecture delivered.
  - Delay between two submissions: 
    - it is a range: default [400, 900] in ms.
  - When IUST figures out we are doing too many requests; `429` error,
    - default delay: 45000ms.
    *yes it takes this much normally to restore our reputation with IUST servers*




# How to get cookie
- login to your Student Account
- go to this page https://studentservice.iust.ac.in/Services/ls-acknowledge-lecture-plan (can be any xD)
- the first request to this page.. get the cookie in the Headers.
- Tip: click Preserve logs >> it saves life... xP.

Here a quick demo that might help.
<video src="https://github.com/user-attachments/assets/afbb76fe-4a1f-4635-9df1-8754f4f64ad4"></video>


