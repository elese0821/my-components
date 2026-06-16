import instance from '../instance';

const todoService = {
    getList: () =>
        instance.get('/user/todo/info').then(r => r.data),

    add: (data: {
        title: string; type: string; category: string;
        priority: string; dueDate: string; memo: string;
    }) =>
        instance.post('/user/todo/info', data).then(r => r.data),

    update: (todoIdx: number, data: {
        title: string; type: string; category: string;
        priority: string; dueDate: string; memo: string;
    }) =>
        instance.patch('/user/todo/info', { ...data, todoIdx }).then(r => r.data),

    toggleDone: (todoIdx: number, done: boolean) =>
        instance.patch('/user/todo/done', { todoIdx, done }).then(r => r.data),

    remove: (todoIdx: number) =>
        instance.delete('/user/todo/info', { data: { todoIdx } }).then(r => r.data),

    removeCompleted: () =>
        instance.delete('/user/todo/completed').then(r => r.data),
};

export default todoService;
