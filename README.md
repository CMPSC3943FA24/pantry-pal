### Documentation for Team Setup

Here’s a detailed guide for you to get up and running with the Dockerized Expo environment.

#### 1. **Prerequisites**:
   - **Docker**: Install Docker Desktop from [here](https://www.docker.com/products/docker-desktop).
   - **Git**: Ensure Git is installed on your machines.
   - **VS Code**: Visual Studio Code should be installed, as it will be the primary editor.

#### 2. **Cloning the Repository**:
   Clone the repository from GitHub:
   ```bash
   git clone https://github.com/CMPSC3943FA24/pantry-pal.git
   cd pantry-pal
   ```

#### 3. **Setting Up Docker**:
   After cloning the repository, you will need to build the Docker image and run the container:

   1. **Build the Docker Image**:
      This command will build the Docker image for the project:
      ```bash
      docker build -t pantrypal-expo .
      ```

   2. **Run the Docker Container**:
      Run the Docker container and expose the port for Expo:
      ```bash
      docker run -it -p 19000:19000 pantrypal-expo
      ```

      - **Explanation**: The `-p 19000:19000` option exposes the Expo server on port 19000, which the Expo Go app or browser can connect to.

#### 4. **Starting the Expo Server**:
   Once inside the Docker container, you can start the Expo server if it doesn't start for you:
   ```bash
   npm start
   ```

   The Expo QR code will be displayed, which can be scanned using the **Expo Go app** (available on iOS and Android). This allows testing the app on physical devices.

#### 5. **Running Tests (Jest)**:
   For running tests, you can use the following command inside the Docker container:
   ```bash
   npm test
   ```

   This will run all the Jest tests and ensure that everything is functioning as expected. (There are no tests until we make them)

#### 6. **Final Steps**:
   Once everything is set up, they can:
   - **Open VS Code**: Run the command to open the project in VS Code:
     ```bash
     code .
     ```
   - **Start developing**: They can make changes to the codebase, and any saved changes should be reflected automatically via Expo’s hot reload.


### Git Workflow with Feature Branches

We’ll use the following workflow to ensure our team works on feature branches and only merges into `prod`, `dev`, or `qa` when ready:

1. **Start from the Main Development Branch**:
   You should always start by pulling from the `dev` branch. This ensures that your feature branches are up to date with the latest development work.

   ```bash
   git checkout dev
   git pull origin dev
   ```

2. **Create a Feature Branch**:
   After pulling the latest code from `dev`, you can create a new feature branch. The naming convention should reflect the purpose of the branch, making it easier to track. For example:
   - Feature branch names: `feature/<feature-name>`
   - Bug fix branch names: `bugfix/<issue-description>`
   
   Create a new branch using:
   ```bash
   git checkout -b feature/feature-name
   ```

3. **Work on the Feature**:
   Once on the feature branch, you can develop, run the app, and test the feature inside your own Docker environment.

   - Run the Expo app with:
     ```bash
     docker run -it -p 19000:19000 pantrypal-expo
     ```

4. **Commit Changes**:
   After making changes, you should commit your work to the feature branch:
   ```bash
   git add .
   git commit -m "Description of the feature or fix"
   ```

5. **Push to GitHub**:
   Once the changes are committed, you’ll push the feature branch to GitHub:
   ```bash
   git push origin feature/feature-name
   ```

6. **Create a Pull Request**:
   After pushing the feature branch, you can create a pull request (PR) on GitHub to merge your changes back into `dev` or another relevant branch. This allows for code review and testing before the code is merged into the main branches (`dev`, `qa`, `prod`).

   - To create the PR, you’ll:
     - Go to the GitHub repository.
     - Select the **feature/feature-name** branch.
     - Click **New Pull Request**.
     - Make sure they are merging **into `dev` or `qa`**, not `prod`.

7. **Merging the Pull Request**:
   Once the pull request is reviewed and approved by other team members, the team can merge the feature branch into `dev` or `qa`. Only after testing in `dev` or `qa` should code be merged into `prod`.

8. **Delete the Feature Branch**:
   After the PR is merged, the feature branch can be deleted:
   ```bash
   git branch -d feature/feature-name
   git push origin --delete feature/feature-name
   ```
