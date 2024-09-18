### Section 1: Prerequisites and Downloads

In this section, we’ll list everything the team needs to download and install before setting up the development environment. We'll cover tools for both **Windows** and **macOS**, along with necessary extensions for VS Code.

---

### 1. **Download and Install Visual Studio Code (VS Code)**

VS Code will be the primary code editor for this project.

- **Download VS Code** from the official site:
  - [VS Code for Windows, macOS, and Linux](https://code.visualstudio.com/)

---

### 2. **VS Code Extensions**

Install a few key extensions in VS Code to work effectively:

1. **GitHub Extension** (Optional, but Recommended):  
   This allows you to clone repositories, manage pull requests, and do other GitHub operations directly in VS Code.
   - Install via [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github).

2. **Prettier (Code Formatter)** (Optional):  
   To maintain consistent code formatting across the team.
   - Install via [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

---

### 3. **Install Git**

Git is required to clone the repository and perform version control tasks. Follow the steps below to install Git depending on your operating system:

#### For Windows Users:
- If using WSL (Windows Subsystem for Linux), install Git inside the Linux distribution:
  ```bash
  sudo apt update
  sudo apt install git
  ```
- If not using WSL, you can install Git for Windows:
  - Download and install Git from [Git's official website](https://git-scm.com/).

#### For macOS Users:
- Git usually comes pre-installed on macOS. If not, you can use:
  - **Homebrew:**  
    ```bash
    brew install git
    ```
  - **Xcode Developer Tools:**  
    ```bash
    xcode-select --install
    ```

#### Verify Git Installation:
After installing Git, verify the installation:
```bash
git --version
```

---

### 4. **Install Node.js and npm**

Node.js is required to run JavaScript applications and manage packages. We'll use npm to install other necessary tools.

- **Download Node.js**:
  - [Node.js Official Site](https://nodejs.org/)

Install the **LTS (Long Term Support)** version for stability.

---

### 5. **Install Expo CLI and Ngrok**

Expo CLI is the command-line tool for React Native applications, and Ngrok allows secure tunneling to your local environment.

Install both globally using npm:
```bash
npm install -g expo-cli @expo/ngrok@^4.1.0
```

---

### Section 2: Setting Up the Workspace and Cloning the Git Repository

Here’s how to create a workspace on your machine and clone the project repository.

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

### 2. **Create a Directory for Your Project**

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

### Section 3: Setting Up GitHub Personal Access Token for Private Repository Access

Since the repository is private, you will need a **GitHub Personal Access Token (PAT)** to clone the repository and perform other Git operations.

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

### 4. **Clone the GitHub Repository**

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
---

### Section 4: Running the Development Environment

Now that you have everything set up, it's time to start the local development environment.

1. **Navigate** to the project directory in your terminal if you're not already there.
2. **Run Expo with Tunnel Mode**:

   To make sure your phone can connect to the development environment, you’ll run the Expo server with the `--tunnel` flag:
   
   ```bash
   npx expo start --tunnel
   ```

   - The `--tunnel` flag ensures that Expo sets up a tunnel so that your phone can connect to the development server even if it’s on a different network.

3. **Scan the QR Code**: Once Expo starts, a QR code will appear in the terminal. Open the **Expo Go** app on your phone and scan the QR code to connect to the development server.

### Section 5: Git Workflow with Feature Branches

To ensure the team works effectively with version control, follow these steps for using Git:

1. **Start from the Main Development Branch**:

   ```bash
   git checkout dev
   git pull origin dev
   ```
2. **Create a Feature Branch**:

   ```bash
   git checkout -b feature/feature-name
   ```
3. **Commit Changes**:

   ```bash
   git add .
   git commit -m "Description of the feature or fix"
   ```
4. **Push to GitHub**:

   ```bash
   git push origin feature/feature-name
   ```

5. **Create a Pull Request** on GitHub to merge changes back into `dev`.
6. **Merge and Delete the Feature Branch** after the review:
   ```bash
   git branch -d feature/feature-name
   git push origin --delete feature/feature-name
   ```