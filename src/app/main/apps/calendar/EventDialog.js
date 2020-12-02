import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { DatePicker, TimePicker } from '@material-ui/pickers';
import moment from 'moment';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import { removeEvent, updateEvent, addEvent, closeNewEventDialog, closeEditEventDialog } from './store/eventsSlice';

import TimeSlotList from './TimeSlotList';

const defaultFormState = {
	id: FuseUtils.generateGUID(),
	type: 0,
	title: '',
	day: moment(new Date(), 'MM/DD/YYYY'),
	start: moment(new Date(), 'HH:mm'),
	end: moment(new Date(), 'HH:mm'),
	desc: ''
};

const useStyles = makeStyles(theme => ({
	sepLine: {
		height: '1px',
		border: '1px solid #e0e0e0',
		marginBottom: 5
	}
}));

function EventDialog(props) {
	const dispatch = useDispatch();
	const eventDialog = useSelector(({ calendarApp }) => calendarApp.events.eventDialog);
	const { form, handleChange, setForm, setInForm } = useForm(defaultFormState);
	const classes = useStyles(props);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (eventDialog.type === 'edit' && eventDialog.data) {
			setForm({ ...eventDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (eventDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...eventDialog.data,
				id: FuseUtils.generateGUID()
			});
		}
	}, [eventDialog.data, eventDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (eventDialog.props.open) {
			initDialog();
		}
	}, [eventDialog.props.open, initDialog]);

	function closeComposeDialog() {
		return eventDialog.type === 'edit' ? dispatch(closeEditEventDialog()) : dispatch(closeNewEventDialog());
	}

	function canBeSubmitted() {
		return form.title.length > 0;
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (eventDialog.type === 'new') {
			dispatch(addEvent(form));
		} else {
			dispatch(updateEvent(form));
		}
		closeComposeDialog();
	}

	function handleRemove() {
		dispatch(removeEvent(form.id));
		closeComposeDialog();
	}

	function getStyle(type) {
		return { color: 'white', backgroundColor: type === 'new' ? '#0C70C0' : '#FE7A7B' };
	}

	function changeSlot(checked) {
		checked.sort();
		const selDay1 = moment(form.day, 'YYYY-MM-DD').toDate();
		const selDay2 = moment(form.day, 'YYYY-MM-DD').toDate();
		selDay1.setHours(moment(checked[0], 'HH:mm').toDate().getHours());
		selDay1.setMinutes(moment(checked[0], 'HH:mm').toDate().getMinutes());
		setInForm('start', selDay1);
		selDay2.setHours(
			moment(checked[checked.length - 1], 'HH:mm')
				.toDate()
				.getHours()
		);
		selDay2.setMinutes(
			moment(checked[checked.length - 1], 'HH:mm')
				.toDate()
				.getMinutes()
		);
		// eslint-disable-next-line no-unused-expressions
		if (selDay2.getMinutes() < 30) selDay2.setMinutes(30);
		else {
			selDay2.setHours(selDay2.getHours() + 1);
			selDay2.setMinutes(0);
		}
		setInForm('end', selDay2);
	}

	function changeStartTime(val) {
		setInForm('start', val);
		if (val > form.end) setInForm('end', val);
	}

	function changeEndTime(val) {
		setInForm('end', val);
		if (val < form.start) setInForm('start', val);
	}

	return (
		<Dialog
			{...eventDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
			component="form"
			classes={{
				paper: 'rounded-8'
			}}
		>
			<AppBar position="static" style={getStyle(eventDialog.type)}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1">{eventDialog.type === 'new' ? '新增時段' : '編輯時段'}</Typography>
				</Toolbar>
			</AppBar>

			<form noValidate onSubmit={handleSubmit}>
				<DialogContent classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }}>
					{/* <TextField
						id="title"
						label="類別"
						className="mt-8 mb-16"
						InputLabelProps={{
							shrink: true
						}}
						name="title"
						value={form.title}
						onChange={handleChange}
						variant="outlined"
						autoFocus
						required
						fullWidth
					/> */}

					<InputLabel id="demo-simple-select-label">類別</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="title"
						className="mt-8 mb-16 w-full"
						value={form.title}
						name="title"
						variant="outlined"
						onChange={handleChange}
						autoFocus
						required
					>
						<MenuItem value="視頻問診">視頻問診</MenuItem>
						<MenuItem value="親臨問診">親臨問診</MenuItem>
					</Select>

					<DatePicker
						label="日期"
						inputVariant="outlined"
						value={form.day}
						onChange={date => setInForm('day', date)}
						className="mt-8 mb-16 w-full"
					/>

					<div className="flex justify-between">
						<TimePicker
							label="开始時間"
							inputVariant="outlined"
							value={form.start}
							onChange={changeStartTime}
							className="mt-8 mb-16"
							maxDate={form.end}
						/>

						<TimePicker
							label="結始時間"
							inputVariant="outlined"
							value={form.end}
							onChange={changeEndTime}
							className="mt-8 mb-16"
							minDate={form.start}
						/>
					</div>

					<Select id="location" value={1} className="mt-8 mb-16" variant="outlined" style={{ width: '100%' }}>
						<MenuItem value="1">香港眼科醫院</MenuItem>
					</Select>

					<div className={classes.sepLine} />

					<TimeSlotList start={form.start} end={form.end} changeSlot={changeSlot}/>
				</DialogContent>

				{eventDialog.type === 'new' ? (
					<DialogActions className="justify-between px-8 sm:px-16">
						<Button variant="contained" style={getStyle('new')} type="submit" disabled={!canBeSubmitted()}>
							Add
						</Button>
					</DialogActions>
				) : (
					<DialogActions className="justify-between px-8 sm:px-16">
						<Button variant="contained" style={getStyle('edit')} type="submit" disabled={!canBeSubmitted()}>
							Save
						</Button>
						<IconButton onClick={handleRemove}>
							<Icon>delete</Icon>
						</IconButton>
					</DialogActions>
				)}
			</form>
		</Dialog>
	);
}

export default EventDialog;
