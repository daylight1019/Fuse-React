import FuseAnimate from '@fuse/core/FuseAnimate';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import clsx from 'clsx';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import * as ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import CalendarHeader from './CalendarHeader';
import EventDialog from './EventDialog';
import reducer from './store';
import {
	dateFormat,
	selectEvents,
	openNewEventDialog,
	openEditEventDialog,
	updateEvent,
	getEvents
} from './store/eventsSlice';

window.moment = moment();
moment.locale('zh', {
	week: {
		dow: 1,
		doy: 1
	}
});
const localizer = momentLocalizer(moment);

const DragAndDropCalendar = withDragAndDrop(Calendar);

const allViews = ['day', 'month', 'week']; // Object.keys(Views).map(k => Views[k]);

const formats = {
	// eslint-disable-next-line no-shadow
	monthHeaderFormat: (month, any, localizer) => localizer.format(month, 'MMMM, Y', 'zh'),
	timeGutterFormat: time => localizer.format(time, 'HH:mm', 'zh')
};

const useStyles = makeStyles(theme => ({
	root: {
		'& .rbc-header': {
			padding: '12px 6px',
			fontWeight: 600,
			fontSize: 14
		},
		'& .rbc-label': {
			padding: '8px 6px'
		},
		'& .rbc-today': {
			backgroundColor: 'transparent'
		},
		'& .rbc-header.rbc-today, & .rbc-month-view .rbc-day-bg.rbc-today': {
			borderBottom: `2px solid ${theme.palette.secondary.main}!important`
		},
		'& .rbc-month-view, & .rbc-time-view, & .rbc-agenda-view': {
			padding: '0 24px 0 24px',
			[theme.breakpoints.down('sm')]: {
				padding: 16
			},
			...theme.mixins.border(0)
		},
		'& .rbc-agenda-view table': {
			...theme.mixins.border(1),
			'& thead > tr > th': {
				...theme.mixins.borderBottom(0)
			},
			'& tbody > tr > td': {
				padding: '12px 6px',
				'& + td': {
					...theme.mixins.borderLeft(1)
				}
			}
		},
		'& .rbc-agenda-table': {
			'& th': {
				border: 0
			},
			'& th, & td': {
				padding: '12px 16px!important'
			}
		},
		'& .rbc-time-view': {
			'& .rbc-time-header': {
				...theme.mixins.border(1),
				borderRadius: '12px 12px 0 0'
			},
			'& .rbc-time-content': {
				flex: '0 1 auto',
				...theme.mixins.border(1)
			},
			'& .rbc-time-header-cell': {
				minHeight: 50
			},
			'& .rbc-header': {
				padding: 6,
				fontSize: 25,
				height: 50
			}
		},
		'& .rbc-month-view': {
			'& > .rbc-row': {
				...theme.mixins.border(1)
			},
			'& .rbc-month-row': {
				...theme.mixins.border(1),
				borderWidth: '0 1px 1px 1px!important',
				minHeight: 160
			},
			'& .rbc-header + .rbc-header': {
				...theme.mixins.borderLeft(1)
			},
			'& .rbc-header': {
				...theme.mixins.borderBottom(0)
			},
			'& .rbc-day-bg + .rbc-day-bg': {
				...theme.mixins.borderLeft(1)
			}
		},
		'& .rbc-day-slot .rbc-time-slot': {
			...theme.mixins.borderTop(1),
			opacity: 0.5
		},
		'& .rbc-time-header > .rbc-row > * + *': {
			...theme.mixins.borderLeft(1)
		},
		'& .rbc-time-content > * + * > *': {
			...theme.mixins.borderLeft(1)
		},
		'& .rbc-day-bg + .rbc-day-bg': {
			...theme.mixins.borderLeft(1)
		},
		'& .rbc-time-header > .rbc-row:first-child': {
			...theme.mixins.borderBottom(1)
		},
		'& .rbc-timeslot-group': {
			minHeight: 64,
			...theme.mixins.borderBottom(1)
		},
		'& .rbc-date-cell': {
			padding: 8,
			fontSize: 16,
			fontWeight: 400,
			opacity: 0.5,
			'& > a': {
				color: 'inherit'
			},
			textAlign: 'left'
		},
		'& .rbc-event': {
			borderRadius: 4,
			padding: '8px 8px',
			height: 35,
			backgroundColor: '#0C70C0',
			color: theme.palette.primary.contrastText,
			boxShadow: theme.shadows[0],
			transitionProperty: 'box-shadow',
			transitionDuration: theme.transitions.duration.short,
			transitionTimingFunction: theme.transitions.easing.easeInOut,
			position: 'relative',
			'&:hover': {
				boxShadow: theme.shadows[2]
			}
		},
		'& .rbc-row-segment': {
			padding: '0 4px 4px 4px'
		},
		'& .rbc-off-range-bg': {
			backgroundColor: theme.palette.type === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.16)'
		},
		'& .rbc-show-more': {
			color: theme.palette.secondary.main,
			background: 'transparent'
		},
		'& .rbc-addons-dnd .rbc-addons-dnd-resizable-month-event': {
			position: 'static'
		},
		'& .rbc-addons-dnd .rbc-addons-dnd-resizable-month-event .rbc-addons-dnd-resize-month-event-anchor:first-child': {
			left: 0,
			top: 0,
			bottom: 0,
			height: 'auto'
		},
		'& .rbc-addons-dnd .rbc-addons-dnd-resizable-month-event .rbc-addons-dnd-resize-month-event-anchor:last-child': {
			right: 0,
			top: 0,
			bottom: 0,
			height: 'auto'
		}
	},
	addButton: {
		position: 'absolute',
		right: 35,
		top: 172,
		zIndex: 99,
		backgroundColor: '#20a0e0',
		color: 'white'
	}
}));

function Event({ event }) {
	const startTime = moment(event.start).format('HH:mm');
	const endTime = moment(event.end).format('HH:mm');
	return (
		<span className="flex justify-between">
			{`${startTime} - ${endTime}`}
			<strong>{event.title}</strong>
		</span>
	);
}

function CalendarApp(props) {
	const dispatch = useDispatch();
	const events = useSelector(selectEvents).map(event => ({
		...event,
		day: moment(event.day, dateFormat).toDate(),
		start: moment(event.start, dateFormat).toDate(),
		end: moment(event.end, dateFormat).toDate()
	}));

	const classes = useStyles(props);
	const headerEl = useRef(null);

	useEffect(() => {
		dispatch(getEvents());
	}, [dispatch]);

	function moveEvent({ event, day, start, end }) {
		dispatch(
			updateEvent({
				...event,
				day,
				start,
				end
			})
		);
	}

	function resizeEvent({ event, day, start, end }) {
		delete event.type;
		dispatch(
			updateEvent({
				...event,
				day,
				start,
				end
			})
		);
	}

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-auto relative')}>
			<div ref={headerEl} />
			<DragAndDropCalendar
				className="flex flex-1 container"
				selectable
				localizer={localizer}
				events={events}
				onEventDrop={moveEvent}
				resizable
				onEventResize={resizeEvent}
				defaultView={Views.MONTH}
				defaultDate={new Date(2020, 3, 1)}
				startAccessor="start"
				endAccessor="end"
				views={allViews}
				step={30}
				formats={formats}
				min={moment('06:00', 'HH:mm').toDate()}
				max={moment('23:59', 'HH:mm').toDate()}
				eventPropGetter={event => {
					if (event.type === 1) {
						return {
							className: 'edit-event',
							style: {
								backgroundColor: '#FE7A7B'
							}
						};
					}
					return {};
				}}
				components={{
					toolbar: _props => {
						return headerEl.current
							? ReactDOM.createPortal(<CalendarHeader {..._props} />, headerEl.current)
							: null;
					},
					month: {
						event: Event
					}
				}}
				// onNavigate={handleNavigate}
				onSelectEvent={event => {
					dispatch(openEditEventDialog(event));
				}}
				onSelectSlot={slotInfo => dispatch(openNewEventDialog(slotInfo))}
			/>
			<FuseAnimate animation="transition.expandIn" delay={500}>
				<Fab
					color="secondary"
					aria-label="add"
					className={classes.addButton}
					onClick={() =>
						dispatch(
							openNewEventDialog({
								day: new Date(),
								start: new Date(),
								end: new Date()
							})
						)
					}
				>
					<Icon>add</Icon>
				</Fab>
			</FuseAnimate>
			<EventDialog />
		</div>
	);
}

export default withReducer('calendarApp', reducer)(CalendarApp);

/*
IE 11 Fix
*/
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = s => {
		let el = this;

		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};
}
