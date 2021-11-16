import { basicUniverseType } from "./types";

class MangoError extends Error {
    id: number | string;
    serverName: basicUniverseType;
    constructor(message: string, id: number | string, server: basicUniverseType) {
        super(`${message}: Server: ${server}, QueryID: ${id}`);
        this.name = "MangoError";
        this.serverName = server;
        this.id = id;
    }
}

export class UserNotFoundError extends MangoError {
    constructor(userID: number | string, serverName: basicUniverseType) {
        super(`User not found in MongoDB`, userID, serverName);
        this.name = "UserNotFoundError";

    }

}

export class UniBaseNotFoundError extends MangoError {
    constructor(uniID: number | string, serverName: basicUniverseType) {
        super(`Universe item not found in MongoDB`, uniID, serverName);
        this.name = "UniBaseNotFoundError";

    }

}

export class OriginalReqVarError extends MangoError {
    constructor(variantID: number, serverName: basicUniverseType) {
        super(`Requested Variant but received Original`, variantID, serverName);
        this.name = "OriginalReqVarError";

    }

}