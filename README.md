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

1. Go to [MySQL's official website](https://dev.mysql.com/downloads/).
- If Windows: click **MySQL Installer for Windows** and download. When prompted, select **Setup Type > Developer Default**. If "MySQL for Visual Studio" gives a failing requirement error, click "Next > Continue" and ignore this particular installation. If any installation fails, click "Retry All".
- If MacOS: download **Workbench**, **Community Server**, **Router**, **Shell** and install.
2. After installation, you need to configure your MySQL server. Click "Next" through, and set a password for the `root` user when prompted.
3. Start the MySQL Workbench. You should already see a "Local instance MySQL80" under "MySQL Connections". Click on the instance, enter your password, and tick "Save password in vault".
4. If all is good you should see the database. On the middle left, at the blank spaces in "Schema", right click and select "Create schema". Create a schema called `iplanner`, **all lowercase**.

### Springboot JPA Configuration

1. Create `application-dev.properties` in directory `backend/src/main/resources` (i.e. the same directory as `application.properties`). This file is `.gitignore`'d from the project and contains local development environment information.
2. Copy-paste the following configuration into the newly created file, and change `<mysql-password>` to your MySQL local password:
   ```
   spring.datasource.url = jdbc:mysql://127.0.0.1:3306/iplanner?characterEncoding=UTF-8&serverTimezone=GMT%2D6
   spring.datasource.username = root
   spring.datasource.password = <mysql-password>
   spring.datasource.driver-class-name = com.mysql.jdbc.Driver
   spring.jpa.properties.hibernate.hdm2ddl.auto = update

   spring.jpa.show-sql = true
   spring.jpa.properties.hibernate.format_sql = true
   ```
3. In VSCode, reload your Java Project by "View > Command Palette" (in Windows `Ctrl+Shift+P`), search for "Java > Clean Java Language Server Workspace", hit Enter, and click "Reload and Delete" on the bottom-right pop-up.
4. Open `IplannerApplication.java` and hit `Debug`. If everything is configured the backend should start successfully.

### Import Database from SQL file

1. In MySQL, select "Server > Data Import".
2. Tick "Import from Self-Contained File" and select the target SQL file in `/backend/sql`.
3. Select "Default Target Schema" to `iplanner`.
4. Select "Dump Structure and Data" (or data/structure only, on need).
5. Click "Start Import".