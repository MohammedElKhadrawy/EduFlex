![EduFlex](https://github.com/MohammedElKhadrawy/EduFlex/blob/main/Front-End/src/assets/EduFlex.png)
## 1- Requirements:<br/><br/>

- Nodejs **v18.20.3 (LTS)** > https://nodejs.org/en/download/package-manager
- Python **v3.11.9** > https://www.python.org/downloads/<br/><br/>

## 2- Steps to run the project:<br/><br/>

- Clone the repository to your local machine, here is how: https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository
- Create a new environment configuration file for the Front-End:

  - Navigate to the Front-End directory.
  - Create a new file named **.env**.
  - Paste the following text into the **.env** file:<br/><br/>
     
  ```
  VITE_API_URL=https://eduflex.com/api
  VITE_BACK_END_URL=http://localhost:5000/api/v1
  VITE_BACK_END_DOMAIN=http://localhost:5000/
  VITE_AI_COMMENT=http://localhost:5002
  VITE_AI_ID=http://localhost:5001
  ```

- Create a new environment configuration file for the Back-End:

  - Navigate to the Back-End directory.
  - Create a new file named **.env**.
  - Paste the following text into the **.env** file:<br/><br/>
  ```
  MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
  JWT_SECRET=<your-jwt-secret>
  JWT_LIFESPAN=<your-jwt-lifespan>
  MY_MAIL=<your-email>
  MAIL_PW=<your-email-password>
  ```
- To set up the required dependencies for the AI models:

  - Navigate to the AI directory.
  - Open the comment detection model directory.
  - Open a terminal and execute the following command:<br/><br/>
  ```
   pip install -r requirements.txt
  ```
  - Repeat the above steps for the ID detection model directory.

- To set up the required dependencies for the Front-End:
  - Navigate to the Front-End directory.
  - Open a terminal and execute the following command:<br/><br/>
  ```
  npm install
  ```
- To set up the required dependencies for the Back-End:
  - Navigate to the Back-End directory.
  - Open a terminal and execute the following command:<br/><br/>
  ```
  npm install
  ```

- To run the AI models, Navigate to the AI directory then follow these steps:

  - For the Comment Detection model:

    - Navigate to the comment detection model directory and open a terminal then execute the following command:<br/><br/>
    ```
    python app.py
    ```
    
  - For the ID Detection model:
  
    - Navigate to the ID detection model directory and open a terminal then execute the following command:<br/><br/>
    ```
    python app.py
    ```

- To run the Front-End, follow these steps:

  - Navigate to the Front-End directory and open a terminal then execute the following command:<br/><br/>
  ```
  npm run dev
  ```
- To run the Back-End, follow these steps:

  - Navigate to the Back-End directory and open a terminal then execute the following command:<br/><br/>
  ```
  npm start
  ```

- Finally, open a browser and enter the local host URL `http://localhost:5173`.
- Enjoy ❤️

   
