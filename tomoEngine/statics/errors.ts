export class MangoError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MangoError";
    }
}

export class UserNotFoundError extends MangoError {
    userID: number | string;
    serverName: string;
    constructor(userID: number | string, serverName: string) {
        super(`User not found in MongoDB server (${serverName}): ${userID}`);
        this.name = "UserNotFoundError";
        this.userID = userID;
        this.serverName = serverName;

    }

}