class SQLFeatures {
    constructor(baseQuery, queryString, initialParams = []) {
        this.query = baseQuery;
        this.queryString = queryString;
        this.params = initialParams;
    }

    filter(mappings = {}) {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach((el) => delete queryObj[el]);

        Object.keys(queryObj).forEach((key) => {
            if (mappings[key]) {
                this.params.push(queryObj[key]);
                this.query += ` AND ${mappings[key]} = $${this.params.length}`;
            }
        });

        if (this.queryString.search) {
            this.params.push(`%${this.queryString.search}%`);
            this.query += ` AND (title ILIKE $${this.params.length} OR content ILIKE $${this.params.length})`;
        }

        return this;
    }

    sort(defaultSort = 'n.updated_at DESC') {
        let sortBy = defaultSort;
        if (this.queryString.sort) {
            sortBy = this.queryString.sort.split(',').join(', ');
        }
        this.query += ` ORDER BY ${sortBy}`;
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const offset = (page - 1) * limit;

        this.params.push(limit, offset);
        this.query += ` LIMIT $${this.params.length - 1} OFFSET $${this.params.length}`;

        return this;
    }
}

module.exports = SQLFeatures;

