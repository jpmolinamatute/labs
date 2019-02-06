function checkEntry(value) {
    let valid = false;

    if (typeof value === 'object'
        && value !== null
        && typeof value.weight === 'number'
        && value.weight > 0
        && value.date instanceof Date) {
        valid = true;
    }
    return valid;
}

export default class WeightLog {
    constructor(newValue = false) {
        this.storageName = 'weigth';
        this.init(newValue);
    }

    init(newValue) {
        const logStored = localStorage.getItem(this.storageName);

        if (typeof logStored === 'string' && logStored.length > 0) {
            const tmpLog = JSON.parse(logStored);
            this.myLog = tmpLog.map((tmp) => {
                const dateObj = new Date(tmp.date);
                return {
                    weight: tmp.weight,
                    date: dateObj
                };
            });
        } else {
            this.myLog = [];
        }
        this.write(newValue);
    }

    write(newValue) {
        let valid = false;

        if (checkEntry(newValue)) {
            this.myLog.push(newValue);
            localStorage.setItem(this.storageName, JSON.stringify(this.myLog));
            valid = true;
        }
        return valid;
    }

    read(keyDate) {
        let value = false;
        if (this.myLog.has(keyDate)) {
            value = this.myLog.get(keyDate);
        }
        return value;
    }

    getLog() {
        const log = this.myLog.map((entry) => {
            const x = entry.date.getTime();
            const y = entry.weight;
            return { x, y };
        });

        log.sort((firstEl, secondEl) => {
            let valid = 0;
            if (firstEl.x > secondEl.x) {
                valid = 1;
            } else if (firstEl.x < secondEl.x) {
                valid = -1;
            }
            return valid;
        });
        return log;
    }

    clear() {
        this.myLog = [];
        localStorage.removeItem(this.storageName);
    }
}
