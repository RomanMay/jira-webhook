


class CoreService {

    handleNewRecord(record: RecordType){

        process(record)

        ReportOutput.write(record)
    }
}

class ReportOutput {
    constructor(provider: GoogleSheetService){}

    write()
}