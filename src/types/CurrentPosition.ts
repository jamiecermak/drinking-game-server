class CurrentPosition {
    public row_limit: number
    public column_limit: Array<number>

    public row: number = 0
    public column: number = 0

    constructor( row_config: Array<number> ) {
        this.row_limit = row_config.length
        this.column_limit = row_config
    }

    public advance(): boolean {
        if ( this.column < this.column_limit[this.row] ) {
            this.column += 1
            return true
        }

        if ( this.row < this.row_limit ) {
            this.column = 0
            this.row += 1
            return true
        }

        return false
    }

    public getArray(): Array<number> {
        return [this.row, this.column]
    }
}