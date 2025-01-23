import readline from "readline";

// Create an interface to read input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function to wrap `rl.question` in a promise
function askQuestion(query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}

export { rl, askQuestion };
