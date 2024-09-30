const MongoDBService = require("./lib/mongodbService"); // Ensure the path is correct
const { program } = require("commander");

const mongoService = new MongoDBService();

program
  .command("start")
  .description("Start all MongoDB services")
  .action(() => {
    mongoService
      .startAllServices()
      .then(() => console.log("MongoDB Services Started"))
      .catch((error) => {
        console.error(error.message);
      });
  });

program
  .command("stop")
  .description("Stop all MongoDB services")
  .action(() => {
    mongoService
      .stopAllServices()
      .then(() => console.log("MongoDB Services stopped"))
      .catch((error) => {
        console.error(error.message);
      });
  });

// Parse the command line arguments
program.parse(process.argv);

// If no command is passed, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
