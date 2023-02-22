# iPlanner

## Backend Dev Environment Setup

1. Download and install [JDK 17 Installer](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html).
2. Install Maven:
* If Windows, install Chocolatey:
  ```ps
  Set-ExecutionPolicy AllSigned
  Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
  ```
  Then install Maven by:
  ```ps
  choco install maven
  ```
* If MacOS/Linux, install homebrew:
  ```sh
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  ```
  Then install Maven by:
  ```sh
  brew install maven
  ```

3. In VSCode, install extensions "Extension Pack for Java" and "Spring Boot Extension Pack."
4. Set VSCode settings "Java > Jdt > Ls > Java: Home" to your java executable's directory.
* For Windows, the directoy will be something like `c:\\Program Files\\Java\\jdk-17`, **make sure to use escaped backslash characters!**.
* For MacOS, get the directory by running `/usr/libexec/java_home -v 17` in your terminal.
5. **While you are in the main Java file `IplannerApplication.java`**, click `F5` to run.

## Frontend Dev Environment Setup

1. Install [Node.js](https://nodejs.org/en/download/).
2. Install `yarn` via `npm`:
   ```sh
   npm install --global yarn
   ```
3. Start the frontend server:
   ```sh
   cd frontend/
   yarn start
   ```