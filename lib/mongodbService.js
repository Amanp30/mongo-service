const { exec } = require("child_process");
const { promisify } = require("util");

class MongoDBService {
  constructor() {
    this.serviceNames = ["MongoDB(1)", "MongoDB(2)"];
    this.execPromise = promisify(exec); // Promisify exec
  }

  getServiceStatus(serviceName) {
    return this.execPromise(`sc query "${serviceName}"`)
      .then(({ stdout }) => {
        if (stdout.includes("RUNNING")) {
          return true; // Service is running
        }
        return false; // Service is not running
      })
      .catch((error) => {
        throw new Error(
          `Error checking status of service ${serviceName}: ${error.message}`
        );
      });
  }

  startService(serviceName) {
    return this.getServiceStatus(serviceName).then((isRunning) => {
      if (isRunning) {
        throw new Error(`Service "${serviceName}" already running`);
      }
      return this.execPromise(`sc start "${serviceName}"`).then(
        ({ stdout, stderr }) => {
          if (stderr) {
            throw new Error(`Error starting service ${serviceName}: ${stderr}`);
          }
          return `Service ${serviceName} started successfully. Output: ${stdout}`;
        }
      );
    });
  }

  stopService(serviceName) {
    return this.execPromise(`sc stop "${serviceName}"`)
      .then(({ stdout, stderr }) => {
        if (stderr) {
          throw new Error(`Error stopping service ${serviceName}: ${stderr}`);
        }
        return `Service ${serviceName} stopped successfully. Output: ${stdout}`;
      })
      .catch((error) => {
        throw new Error(
          `Error stopping service ${serviceName}: ${error.message}. May be services are not running
            `
        );
      });
  }

  startAllServices() {
    return Promise.all(
      this.serviceNames.map((serviceName) => this.startService(serviceName))
    );
  }

  stopAllServices() {
    return Promise.all(
      this.serviceNames.map((serviceName) => this.stopService(serviceName))
    );
  }
}

module.exports = MongoDBService;
