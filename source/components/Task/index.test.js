import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Task from './index';

configure({ adapter: new Adapter() });

const initialState = {
    isEditable:  false,
    description: '',
};

const task = {
    id:        'd13edg45tg4d45',
    message:   'Test task for testing purpose',
    completed: false,
    favorite:  false,
};

const props = {
    completed:         task.completed,
    favorite:          task.favorite,
    id:                task.id,
    message:           task.message,
    removeTaskHandler: jest.fn(),
    updateTask:        jest.fn(),
};

const inEditModeState = {
    isEditable:  true,
    description: props.message,
};

const result = mount(<Task { ...props } />);

describe('Task', () => {
    test('Should create 1 \'li\' element', () => {
        expect(result.find('li')).toHaveLength(1);
    });

    test('Should not have an input field initially', () => {
        expect(result.find('input')).toHaveLength(0);
    });

    test('Should have a valid initial state', () => {
        expect(result.state()).toEqual(initialState);
    });

    test('Should correctly react after click on Edit icon', () => {
        result.find('Edit').simulate('click');
        expect(result.find('input')).toHaveLength(1);
        expect(result.state()).toEqual(inEditModeState);

        result.find('Edit').simulate('click');
        expect(result.find('input')).toHaveLength(0);
        expect(result.state(['isEditable'])).toBe(false);
    });

    test('Should call correct method after click on Remove icon', () => {
        result.find('Remove').simulate('click');
        expect(result.props().removeTaskHandler).toHaveBeenCalledWith(props.id);
    });

    test('Should call correct method after click on Star icon', () => {
        result.find('Star').simulate('click');
        expect(result.props().updateTask).toHaveBeenCalledWith([{ ...task, favorite: !task.favorite }]);
    });

    test('Should call correct method after click on Ckeckbox icon', () => {
        result.find('Checkbox').simulate('click');
        expect(result.props().updateTask).toHaveBeenCalledWith([{ ...task, completed: !task.completed }]);
    });
});
