import FuseUtils from '@fuse/utils';
import moment from 'moment';
import mock from '../mock';

function setDate(year, month, date, hours, minutes, seconds) {
	return moment(new Date(year, month, date, hours, minutes, seconds)).format('YYYY-MM-DDTHH:mm:ss.sssZ');
}

const calendarDB = {
	events: [
		{
			id: 0,
			type: 0,
			title: '視頻問診',
			day: setDate(2020, 3, 0),
			start: setDate(2020, 3, 0),
			end: setDate(2020, 3, 1)
		},
		{
			id: 1,
			type: 0,
			title: '視頻問診',
			day: setDate(2020, 3, 7),
			start: setDate(2020, 3, 7),
			end: setDate(2020, 3, 10)
		},
		{
			id: 2,
			type: 0,
			title: '視頻問診',
			day: setDate(2020, 3, 13),
			start: setDate(2021, 2, 13, 0, 0, 0),
			end: setDate(2021, 2, 20, 0, 0, 0)
		},
		{
			id: 3,
			type: 0,
			title: '視頻問診',
			day: setDate(2021, 10, 6),
			start: setDate(2021, 10, 6, 0, 0, 0),
			end: setDate(2021, 10, 13, 0, 0, 0)
		},
		{
			id: 4,
			type: 0,
			title: '視頻問診',
			day: setDate(2020, 3, 9, 0, 0, 0),
			start: setDate(2020, 3, 9, 0, 0, 0),
			end: setDate(2020, 3, 9, 0, 0, 0)
		},
		{
			id: 5,
			type: 0,
			title: '視頻問診',
			day: setDate(2020, 3, 11),
			start: setDate(2020, 3, 11),
			end: setDate(2020, 3, 13),
			desc: 'Big conference for important people'
		},
		{
			id: 6,
			type: 0,
			title: '視頻問診',
			day: setDate(2020, 3, 12, 0, 0, 0),
			start: setDate(2020, 3, 12, 10, 30, 0, 0),
			end: setDate(2020, 3, 12, 12, 30, 0, 0),
			desc: 'Pre-meeting meeting, to prepare for the meeting'
		},
		{
			id: 7,
			type: 1,
			title: '視頻問診',
			day: setDate(2020, 3, 12, 0, 0, 0),
			start: setDate(2020, 3, 12, 12, 0, 0, 0),
			end: setDate(2020, 3, 12, 13, 0, 0, 0),
			desc: 'Power lunch'
		},
		{
			id: 8,
			type: 0,
			title: '視頻問診',
			day: setDate(2020, 3, 12, 0, 0, 0),
			start: setDate(2020, 3, 12, 14, 0, 0, 0),
			end: setDate(2020, 3, 12, 15, 0, 0, 0)
		},
		{
			id: 9,
			type: 0,
			title: '視頻問診',
			day: setDate(2020, 3, 12, 0, 0, 0),
			start: setDate(2020, 3, 12, 17, 0, 0, 0),
			end: setDate(2020, 3, 12, 17, 30, 0, 0),
			desc: 'Most important meal of the day'
		},
		{
			id: 10,
			type: 0,
			title: '視頻問診',
			day: setDate(2020, 3, 12, 0, 0, 0),
			start: setDate(2020, 3, 12, 20, 0, 0, 0),
			end: setDate(2020, 3, 12, 21, 0, 0, 0)
		},
		{
			id: 11,
			type: 0,
			title: '視頻問診',
			day: setDate(2020, 3, 13, 0, 0, 0),
			start: setDate(2020, 3, 13, 7, 0, 0),
			end: setDate(2020, 3, 13, 10, 30, 0)
		},
		{
			id: 12,
			type: 0,
			title: '視頻問診',
			day: setDate(2020, 3, 17, 0, 0, 0),
			start: setDate(2020, 3, 17, 19, 30, 0),
			end: setDate(2020, 3, 17, 20, 0, 0)
		},
		{
			id: 13,
			type: 0,
			title: '視頻問診',
			day: setDate(2020, 3, 20, 0, 0, 0),
			start: setDate(2020, 3, 20, 19, 30, 0),
			end: setDate(2020, 3, 20, 20, 0, 0)
		}
	]
};

mock.onGet('/api/calendar-app/events').reply(config => {
	return [200, calendarDB.events];
});

mock.onPost('/api/calendar-app/add-event').reply(request => {
	const data = JSON.parse(request.data);
	const newEvent = {
		...data.newEvent,
		id: FuseUtils.generateGUID()
	};
	calendarDB.events = [...calendarDB.events, newEvent];
	return [200, newEvent];
});

mock.onPost('/api/calendar-app/update-event').reply(request => {
	const data = JSON.parse(request.data);

	calendarDB.events = calendarDB.events.map(event => {
		if (data.event.id === event.id) {
			return data.event;
		}
		return event;
	});

	return [200, data.event];
});

mock.onPost('/api/calendar-app/remove-event').reply(request => {
	const data = JSON.parse(request.data);
	const event = calendarDB.events.find(_event => data.eventId === _event.id);
	calendarDB.events = calendarDB.events.filter(_event => _event.id !== event.id);

	return [200, event];
});
