export default interface Calendar {
    scheduleIdx: number;
    scheduleTitle: string;
    fromDt:   string;
    toDt:     string;
    color:    string;
    contents: string;
    allDay:   boolean;
    category: string;
    priority: string;
    repeat:   string;
    url:      string;
    done:     boolean;
}
