module.exports = () => {

    class Storage {
        constructor() {

        }

        testLength() {
            return Storage.store.length;
        }

        getData() {
            return Storage.store.reduce((res, curr) => res + "\n" + curr);
        }

        addData(data) {
            if (data) {
                Storage.store.push(data);
            }
        }
    }

    Storage.store = [];

    return Storage;
};
