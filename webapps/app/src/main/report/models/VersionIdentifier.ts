export class VersionIdentifier {
    timestamp: Date;
    hash: string;
    id: string;

    constructor(id: string) {
        this.id = id;
        const regex = /(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})-([0-9a-f]{8})/;
        const match = id.match(regex);
        if (match) {
            const [, year, month, day, hours, minutes, seconds, hash] = match;
            this.timestamp = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
            this.hash = hash;
        } else {
            throw Error(`Unable to parse ${id} as version identifier: Did not match regex`);
        }
    }

    compareTo(other: VersionIdentifier): number {
        return this.timestamp.getTime() - other.timestamp.getTime();
    }
}