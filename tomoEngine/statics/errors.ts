class MangoError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MangoError";
    }
}

class UserNotFoundError extends MangoError {
    userID: number;
    serverName: string;
    constructor(userID: number, serverName: string) {
        super(`User not found in MongoDB server (${serverName}): ${userID}`);
        this.name = "UserNotFoundError";
        this.userID = userID;
        this.serverName = serverName;

    }

}