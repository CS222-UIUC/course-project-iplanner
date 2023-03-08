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

## Database Setup

**Read all instructions before you start.**

### MySQL Installation

1. Go to [MongoDB's official website](https://www.mongodb.com/try/download/community), select "Version 6.0.4 (current)", and download the MongoDB installer.
2. Keep everything as default in the installer.
3. Open MongoDB Compass (a GUI tool similar to MySQL workbench). Connect to `localhost:27017` (this should be the default connection).
4. If all is good you should see the database. Create a database named `iplanner` and a collection named `courses`.

### Springboot JPA Configuration

1. Create `application-dev.properties` in directory `backend/src/main/resources` (i.e. the same directory as `application.properties`). This file is `.gitignore`'d from the project and contains local development environment information.
2. Copy-paste the following configuration into the newly created file:
   ```
   spring.data.mongodb.uri = mongodb://localhost:27017/iplanner
   spring.data.mongodb.database = iplanner
   ```
3. In VSCode, reload your Java Project by "View > Command Palette" (in Windows `Ctrl+Shift+P`), search for "Java > Clean Java Language Server Workspace", hit Enter, and click "Reload and Delete" on the bottom-right pop-up.

### Import Database from SQL file

1. Click into `iplanner.courses` in MongoDB Compass. Click "Documents > Add Data > Insert Document".
2. Replace the contents of the pop-up input to contents from `/backend/db/20230307_api_test_courses.json`, and click "Insert".
3. Open `IplannerApplication.java` and hit `Debug`. If everything is configured the backend should start successfully.
