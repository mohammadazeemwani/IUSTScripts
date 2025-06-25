# handy scrips I wrote for IUST

## Demo
here is a working demo that might interest you.
<video src="https://github.com/mohammadazeemwani/IUSTScripts/blob/main/demo/working-demo-lecture-feedback.mp4" controls></video>


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




# How to get cookie
- login to your Student Account
- go to this page https://studentservice.iust.ac.in/Services/ls-acknowledge-lecture-plan (can be any xD)
- the first request to this page.. get the cookie in the Headers.
- Tip: click Preserve logs >> it saves life... xP.

Here a quick demo that might help.
<video src="https://github.com/mohammadazeemwani/IUSTScripts/blob/main/demo/how-to-get-cookie.mp4" controls></video>