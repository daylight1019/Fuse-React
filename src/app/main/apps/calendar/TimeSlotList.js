import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import moment from 'moment';

const MyCheckbox = withStyles({
	root: {
		color: '#70E87C',
		'&@disabled': {
			color: '#AAAAB5'
		}
	}
})(props => <Checkbox color="default" {...props} />);

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		height: 200,
		overflow: 'auto',
		backgroundColor: theme.palette.background.paper
	}
}));

export default function TimeSlotList({ start, end, changeSlot }) {
	const classes = useStyles();
	const [checked, setChecked] = React.useState([]);

	const handleToggle = value => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
		changeSlot(newChecked);
	};

	const buildTimeSlots = (pstart, start, end) => {
		checked.splice(0, checked.length);
		const timeFormat = 'HH:mm';
		const startTime = moment(pstart, timeFormat);
		let hour = startTime.hour();
		let minutes = startTime.minute();
		let nextStartTime;
		let nextEndTime;
		const timeslots = [];
		do {
			nextStartTime = moment(moment(hour, 'HH').add(minutes, 'minutes'), timeFormat);
			nextEndTime = moment(moment(hour, 'HH').add(minutes + 20, 'minutes'), timeFormat);
			if (minutes >= 30 && minutes < 60) {
				hour = (hour + 1) % 24;
			}
			const startVal = moment(start).format(timeFormat);
			const endVal = moment(end).format(timeFormat);
			const startNext = moment(nextStartTime).format(timeFormat);
			if (startNext >= startVal && startNext < endVal && checked.indexOf(startNext) === -1) checked.push(startNext);
			timeslots.push({ nextStartTime, nextEndTime });
			minutes = (minutes + 30) % 60;
		} while (timeslots.length < 48);
		return timeslots;
	};

	return (
		<List dense className={classes.root}>
			{buildTimeSlots('06:00', start, end).map(({ nextStartTime, nextEndTime }) => {
				const timeFormat = 'HH:mm';
				const startTime = moment(nextStartTime).format(timeFormat);
				const endTime = moment(nextEndTime).format(timeFormat);
				const labelId = `checkbox-list-secondary-label-${startTime}`;
				return (
					<ListItem
						key={startTime}
						className="rounded-4 border-1 border-color"
						onClick={handleToggle(startTime)}
						style={{ marginBottom: 3 }}
					>
						<ListItemText id={labelId} primary={`${startTime} - ${endTime}`} />	
						<MyCheckbox
							edge="end"
							checked
							disabled={checked.indexOf(startTime) === -1}
							inputProps={{ 'aria-labelledby': labelId }}
						/>
					</ListItem>
				);
			})}
		</List>
	);
}
