### Section 1: Prerequisites and Downloads

In this section, we’ll list everything the team needs to download and install before you begin setting up the development environment. We'll cover tools for both **Windows** and **macOS**, along with necessary extensions for VS Code.

---

### 1. **Download and Install Visual Studio Code (VS Code)**

VS Code will be the primary code editor for this project, and it will also be used to interact with Docker containers and the development environment.

- **Download VS Code** from the official site:
  - [VS Code for Windows, macOS, and Linux](https://code.visualstudio.com/)

---

### 2. **Install Docker Desktop**

Docker Desktop is required to run the Docker containers for the development environment. This will allow you to create, manage, and run the containerized environment locally.

- **Download Docker Desktop** from the official site:
  - [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
  - [Docker Desktop for macOS](https://www.docker.com/products/docker-desktop)

**Windows Specific Setup**:
- **Enable WSL 2 (Windows Subsystem for Linux)**:
  WSL 2 must be enabled for Docker Desktop to work efficiently on Windows.

  **Steps to enable WSL 2**:
  1. Open **PowerShell as Administrator** and run the following commands:
     ```powershell
     dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
     dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
     ```

  2. **Restart your computer**.

  3. After rebooting, set WSL 2 as the default version:
     ```powershell
     wsl --set-default-version 2
     ```

  4. **Install a Linux distribution** from the Microsoft Store (e.g., Ubuntu).

- **Enable WSL 2 Integration in Docker Desktop**:
  After installing Docker Desktop, you need to enable WSL 2 in Docker Desktop:
  1. Open **Docker Desktop**.
  2. Go to **Settings** > **General**.
  3. Enable **Use the WSL 2 based engine**.
  4. Go to **Settings** > **Resources** > **WSL Integration**.
  5. Enable the **Linux distribution** (e.g., Ubuntu) that you installed earlier.

**macOS Specific Setup**:
- For macOS users, Docker Desktop works natively without requiring WSL, so just follow the regular installation process from the Docker website.

---

### 3. **VS Code Extensions**

Next, you’ll need to install a few key extensions in VS Code to work with Docker, GitHub, and the development environment inside containers.

1. **Remote - Containers Extension**:
   This allows you to open any folder inside a Docker container as a VS Code workspace.

   - Install via [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).

2. **Docker Extension**:
   This extension provides an interface to manage Docker containers directly from within VS Code.

   - Install via [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker).

3. **GitHub Extension** (Optional, but Recommended):
   This allows you to clone repositories, manage pull requests, and do other GitHub operations directly in VS Code.

   - Install via [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github).

4. **Prettier (Code Formatter)** (Optional):
   To maintain consistent code formatting across the team.

   - Install via [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

---

### 4. Install Git

Git is required to clone the repository and perform version control tasks. Follow the steps below to install Git depending on your operating system:

#### For Windows Users:

**If using WSL**, install Git inside the Linux distribution by running:

```bash
sudo apt update
sudo apt install git
```

- If not using WSL, you can install Git for Windows:

  - Download and install Git from Git's official website.
  - During installation, choose to include Git Bash for command-line Git access.

#### For macOS Users:
Git usually comes pre-installed on macOS. However, if it’s not installed, you can use the following options:

- **Homebrew:** Install Git using:

```bash
brew install git
```

- **Xcode Developer Tools:** Install Git using:

```bash
xcode-select --install
```
#### Verify Git Installation:
After installing Git, verify the installation by running the following command in the terminal:

```bash
git --version
```
This will return the installed Git version, confirming that Git is ready to use.

---

### 5. **Node.js (Optional, if Not Using Docker for Dev Environment)**

For local development (outside Docker), ensure that **Node.js** is installed. We use Node.js to run JavaScript/TypeScript-based applications like Expo.

- **Download Node.js**:
  - [Node.js Official Site](https://nodejs.org/)

We recommend installing the **LTS (Long Term Support)** version for stability.

---

### 6. **Expo CLI (Optional)**

Expo CLI is the command-line tool to manage the development server for React Native applications. Although this will run inside the Docker container, you may want to install it locally if you are working outside the container for any reason.

Install Expo globally:
```bash
npm install -g expo-cli
```

---

### Section 2: Setting Up VS Code Workspace and Cloning the Git Repository

In this section, we’ll guide the team through setting up the development workspace in VS Code. This includes using the **Linux WSL** on Windows and the appropriate directory on macOS. We’ll also cover how to open a terminal, switch to WSL in Windows, and clone the GitHub repository into the desired directory.

---

### 1. **Open VS Code and Configure the Terminal**

Once VS Code is installed, you’ll want to configure your terminal to use **WSL** on Windows or the regular terminal on macOS.

#### For **Windows Users**:
We need to make sure that **WSL** is being used in the VS Code terminal instead of PowerShell.

1. **Open VS Code**.
   
2. **Open the Integrated Terminal**:
   - You can open the terminal in VS Code by pressing:
     - **Ctrl + `** (Control and backtick key)
     - Or use the menu: **Terminal** > **New Terminal**

3. **Switch Terminal to WSL**:
   - By default, the terminal might be set to PowerShell. To switch to WSL:
     1. In the terminal, click on the drop-down menu that shows `Powershell`.
     2. Select **WSL** from the list (it will appear as something like **Ubuntu-20.04** or the name of your Linux distribution).

4. **Set WSL as Default Shell (Optional)**:
   - To make WSL the default terminal for all future VS Code sessions, you can:
     1. Open **Command Palette** (`Ctrl + Shift + P`).
     2. Type `Terminal: Select Default Profile` and select it.
     3. Choose **WSL** from the options.
   
This will ensure that all new terminals open using WSL.

#### For **macOS Users**:
1. **Open VS Code**.

2. **Open the Integrated Terminal**:
   - You can open the terminal in VS Code by pressing:
     - **Ctrl + `** (Control and backtick key)
     - Or use the menu: **Terminal** > **New Terminal**
   
Since macOS already runs Unix, you don’t need to switch terminal types. The terminal will open using the default shell (zsh or bash, depending on your macOS version).

---

### 2. **Creating a Directory for Your Project**

Once you have your terminal open and configured, the next step is to create a folder where you will clone the GitHub repository.

#### Steps to Create a Folder:

1. **Navigate to a Desired Location**:
   Use the terminal to navigate to where you want to create the folder for your project. You can do this by using the `cd` (change directory) command.

   Examples:
   - **Windows (WSL)**:
     ```bash
     cd /home/<your-wsl-username>/projects
     ```
   - **macOS**:
     ```bash
     cd ~/projects
     ```

   This command will navigate to the `projects` folder. If this folder doesn’t exist, you can create it with the following command:
   ```bash
   mkdir projects
   cd projects
   ```

2. **Create a New Folder for Your Project**:
   Create a folder for the project where you’ll clone the repository:
   ```bash
   mkdir pantry-pal
   cd pantry-pal
   ```

---


### Section 2-b: Setting Up GitHub Personal Access Token for Private Repository Access

Since the repository is private, our team members will need a **GitHub Personal Access Token (PAT)** with `repo` access in order to clone the repo and perform other Git operations (push, pull, etc.). This section will walk you through creating the token and using it in place of a password when prompted.

---

### 1. **Create a GitHub Personal Access Token (PAT)**

To interact with private repositories via Git (clone, push, pull), you need a GitHub PAT with appropriate permissions. Follow these steps to generate a token:

#### Steps to Create a PAT:
1. **Log into GitHub**:
   - Go to [github.com](https://github.com) and log in to your account.

2. **Go to Settings**:
   - In the top-right corner, click on your profile picture and select **Settings**.

3. **Navigate to Developer Settings**:
   - In the left-hand sidebar, scroll down and click on **Developer settings**.

4. **Go to Personal Access Tokens**:
   - Under **Developer settings**, select **Personal access tokens**, and then click **Tokens (classic)** (GitHub has introduced new fine-grained tokens, but classic tokens are still widely used).

5. **Generate New Token**:
   - Click on **Generate new token**.
   - Give your token a **name/label** (e.g., "Pantry Pal Access Token") to remember what it's for.

6. **Set Expiration**:
   - Choose the expiration period (e.g., 30 days, 60 days, or no expiration, depending on your security needs). It's recommended to choose a short expiration period and regenerate tokens as needed.

7. **Select Scopes**:
   - Under **Select scopes**, check the box next to `repo` to allow access to private repositories.
   - Optionally, you can check other scopes if needed, but for most use cases, `repo` is enough.

8. **Generate Token**:
   - Scroll down and click **Generate token**.
   - **IMPORTANT**: Copy the token **immediately** and store it somewhere safe (like a password manager). You won’t be able to see the token again after this.

---

### 2. **Using the GitHub Token in Place of a Password**

Once you've generated the token, it will be used in place of your password when performing Git operations like cloning, pushing, and pulling from the repository.

#### How to Use the Token:

1. **Cloning the Repository**:
   When you run the `git clone` command for the private repository:
   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   ```
   Git will ask for your **GitHub username** and **password**.

2. **Entering Your Credentials**:
   - **Username**: Enter your GitHub username as usual.
   - **Password**: Instead of entering your GitHub account password, enter the **Personal Access Token** you generated earlier.

   Example:
   ```bash
   Username: <your-username>
   Password: <paste-your-github-token-here>
   ```

#### Example Command:
```bash
git clone https://github.com/<your-username>/<your-repo>.git
```
After running this, Git will prompt for your username and password:
- **Username**: `<your-github-username>`
- **Password**: Paste the Personal Access Token here.

---

### 3. **Store Credentials Locally (Optional)**

To avoid entering your username and token every time you interact with GitHub, you can store your credentials locally using Git's credential helper. This way, Git will remember your credentials for future operations.

#### To Enable Credential Caching:

1. Run the following command in your terminal:
   ```bash
   git config --global credential.helper cache
   ```

2. Set the cache timeout (in seconds). For example, to cache credentials for 1 hour:
   ```bash
   git config --global credential.helper 'cache --timeout=3600'
   ```

This will store your credentials for an hour, making it easier to perform multiple Git operations without repeatedly entering your token.

---

### 4. **Cloning the GitHub Repository**

Now that the directory is set up, you’ll clone the GitHub repository into this folder.

#### Steps to Clone the Repository:

1. **Obtain the GitHub Repository URL**:
   - Go to the GitHub repository page (you should have the URL for the repository).
   - Click the **Code** button and copy the HTTPS link to the repository.

2. **Clone the Repository**:
   In the terminal, run the following command to clone the repository into the `pantry-pal` folder you just created:
   ```bash
   git clone https://github.com/CMPSC3943FA24/pantry-pal.git .
   ```

   - The `.` at the end ensures the repo is cloned into the current folder.

3. **Verify the Repository is Cloned**:
   After the cloning is complete, you can list the files in the directory to ensure everything is cloned correctly:
   ```bash
   ls
   ```

   You should see files like `Dockerfile`, `docker-compose.yml`, `README.md`, and any other project files.

---

### Section 3: Running the Development Environment in Docker

Once the GitHub repository is cloned, the next steps will involve using Docker Compose to build and run the development environment, and then opening the project in VS Code using Dev Containers. Follow the steps below to get your environment running inside a Docker container and connect your phone using Expo.

---

### 1. **Build the Docker Container with Docker Compose**

The repository contains a `docker-compose.yml` and a `Dockerfile` that define how to set up the development environment inside a container. 

#### Steps to Build and Run the Container:

1. **Open the Terminal in Your Project Folder**:
   - If you're not already inside the project folder, navigate to it using the terminal:
     ```bash
     cd /path/to/pantry-pal
     ```

2. **Run Docker Compose to Build and Start the Container**:
   Use Docker Compose to build the container and run the services defined in the `docker-compose.yml` file:
   ```bash
   docker-compose up --build
   ```
   - The `--build` flag ensures that Docker builds the image fresh from the latest code in the repository.

3. **Verify the Container is Running**:
   Once the container is built, Docker Compose will automatically start the container. You should see logs in the terminal indicating that the container is running. The development environment is now ready inside the container.

---

### 2. **Open VS Code Inside the Dev Container**

Once the container is running, you’ll want to open your project in VS Code, which will allow you to interact with the code and container seamlessly.

#### Steps to Open the Project in VS Code:

1. **Open a New VS Code Window**:
   In the terminal, run the following command to open the project in a new VS Code window:
   ```bash
   code .
   ```

2. **Enable Dev Containers in VS Code (If Needed)**:
   When you open VS Code in a Dockerized project for the first time, you might see a popup asking if you want to reopen the window inside a Dev Container.

   - **If you see the popup**: Select **Reopen in Container** to allow VS Code to open the workspace inside the Docker container.
   - **If the popup doesn’t appear**: You may need to manually enable the **Remote - Containers** extension in VS Code. 
     - Go to the **Extensions** tab (left sidebar), search for **Remote - Containers**, and ensure it’s installed.
     - Then, reopen the project in a container by selecting the **Command Palette** (`Ctrl + Shift + P`), typing `Remote-Containers: Reopen in Container`, and selecting it.

3. **VS Code Dev Container Environment**:
   Once you reopen the project in the Dev Container, the VS Code terminal and workspace will be running inside the Docker container. This means any commands you run in the terminal will be executed in the container's environment, not on your local machine.

---

### 3. **Run the Expo Development Server**

With the project running inside the Docker container, you can now start the Expo development server, which allows you to test the app on your phone.

#### Steps to Start Expo:

1. **Open the Terminal Inside VS Code**:
   If the terminal isn’t already open, you can open it by selecting **Terminal** > **New Terminal** in the top menu.

2. **Run Expo with Tunnel Mode**:
   To make sure your phone can connect to the development environment, you’ll run the Expo server with the `--tunnel` flag:
   ```bash
   npx expo start --tunnel
   ```

   - The `--tunnel` flag ensures that Expo sets up a tunnel so that your phone can connect to the development server even if it’s on a different network.

3. **Scan the QR Code**:
   Once Expo starts, a QR code will appear in the terminal. Open the **Expo Go** app on your phone and scan the QR code to connect to the development server.

---




### Section 4: Developing and Testing the App

At this point, your development environment should be fully set up, and you’re ready to start working on the app. You’ll be writing and editing code locally in VS Code, with the Docker container running in the background. When you’re ready to test your changes, you’ll start the Expo server inside the container and use the **Expo Go** app on your phone to test the app in real time.

---

### 1. **Develop Locally in VS Code**

Now that everything is set up, you can start working on the app by writing and editing code in VS Code, just like you would for any other project.

#### Key Points:
- **Editing Code**: You’ll develop locally in VS Code. The code is stored in your local environment and synced to the container automatically through the shared volume defined in the Docker Compose setup.
- **Container Running in the Background**: The Docker container you set up earlier should continue running while you’re developing. This ensures that your development environment is ready for testing when needed.
  
You can focus on writing and improving the code in VS Code, and there’s no need to interact with Docker directly unless you want to stop, restart, or rebuild the container.

---

### 2. **Testing Changes in Expo**

When you want to test the changes you’ve made, you’ll need to start the Expo development server inside the Docker container. This will allow you to preview the app on your phone using the **Expo Go** app.

#### Steps to Test Changes:

1. **Start the Expo Server**:
   In the VS Code terminal inside the Docker container, run the following command to start the Expo server:
   ```bash
   npx expo start --tunnel
   ```

   - The `--tunnel` flag ensures that your phone can connect to the Expo development server, even if it’s on a different network.
   
2. **Connect Your Phone**:
   - Once the Expo server is running, a **QR code** will appear in the terminal.
   - Open the **Expo Go** app on your phone and scan the QR code to load the app.
   
3. **Live Testing**:
   - As you make changes to the code in VS Code, the app should automatically update on your phone through **hot reloading**. This allows you to see changes in real-time without needing to restart the app.
   
---

### Summary of the Development Workflow:

- **Write and Edit Code**: Develop locally using VS Code. The container runs in the background to manage the environment.
- **Start the Expo Server**: When you want to test your changes, run `npx expo start --tunnel` inside the container.
- **Test on Your Phone**: Use the Expo Go app to scan the QR code and test the app on your phone. Any changes you make in VS Code will be reflected on the app in real time.


## Git Workflow with Feature Branches

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
     - Make sure you are merging **into `dev` or `qa`**, not `prod`.

7. **Merging the Pull Request**:
   Once the pull request is reviewed and approved by other team members, the team can merge the feature branch into `dev` or `qa`. Only after testing in `dev` or `qa` should code be merged into `prod`.

8. **Delete the Feature Branch**:
   After the PR is merged, the feature branch can be deleted:
   ```bash
   git branch -d feature/feature-name
   git push origin --delete feature/feature-name
   ```
