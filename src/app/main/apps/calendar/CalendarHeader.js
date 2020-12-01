import FuseAnimate from '@fuse/core/FuseAnimate';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import moment from 'moment';
import React from 'react';
import Toolbar from 'react-big-calendar/lib/Toolbar';
import { navigate } from 'react-big-calendar/lib/utils/constants';
import connect from 'react-redux/es/connect/connect';
import { selectMainThemeDark } from 'app/store/fuse/settingsSlice';

/* eslint-disable react/jsx-no-bind */
const styles = theme => ({
	root: {
		backgroundImage: 'url("../../assets/images/calendar/header.png")',
		backgroundColor: 'lightblue',
		color: '#FFFFFF',
		backgroundSize: 'cover',
		backgroundPosition: '0 50%'
	}
});

const viewNamesObj = {
	month: {
		title: 'Month',
		icon: 'view_module'
	},
	week: {
		title: 'Week',
		icon: 'view_week'
	},
	work_week: {
		title: 'Work week',
		icon: 'view_array'
	},
	day: {
		title: 'Day',
		icon: 'today'
	},
	agenda: {
		title: 'Agenda',
		icon: 'view_agenda'
	}
};

class CalendarHeader extends Toolbar {
	viewButtons() {
		const viewNames = this.props.views;
		const { view } = this.props;

		if (viewNames.length > 1) {
			return viewNames.map(name => (
				<Tooltip title={viewNamesObj[name].title} key={name}>
					<div style={{ textAlign: 'center' }}>
						<IconButton aria-label={name} onClick={() => this.props.onView(name)} disabled={view === name}>
							<Icon>{viewNamesObj[name].icon}</Icon>
						</IconButton>
						<p style={{ marginTop: '-10px' }}>{name}</p>
					</div>
				</Tooltip>
			));
		}
		return null;
	}

	render() {
		const { classes, mainThemeDark, label, date } = this.props;

		return (
			<ThemeProvider theme={mainThemeDark}>
				<div className={clsx(classes.root, 'flex h-200 min-h-200 relative', moment(date).format('MMM'))}>
					<div className="flex flex-1 flex-col p-12 justify-between z-10 container">
						<div className="flex flex-col items-center justify-between sm:flex-row">
							<div className="flex items-center my-16 sm:mb-0">
								<FuseAnimate animation="transition.expandIn" delay={300}>
									<Icon className="text-32 mx-12">today</Icon>
								</FuseAnimate>
								<FuseAnimate animation="transition.slideLeftIn" delay={300}>
									<Typography variant="h6">Calendar</Typography>
								</FuseAnimate>
							</div>
							<div className="flex items-center">{this.viewButtons()}</div>
						</div>

						<FuseAnimate delay={500}>
							<div className="flex items-center justify-center">
								<Tooltip title="Previous">
									<IconButton
										aria-label="Previous"
										onClick={this.navigate.bind(null, navigate.PREVIOUS)}
									>
										<Icon>
											{mainThemeDark.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
										</Icon>
									</IconButton>
								</Tooltip>
								<Typography variant="h6">{label}</Typography>
								<Tooltip title="Next">
									<IconButton aria-label="Next" onClick={this.navigate.bind(null, navigate.NEXT)}>
										<Icon>
											{mainThemeDark.direction === 'ltr' ? 'arrow_forward' : 'arrow_back'}
										</Icon>
									</IconButton>
								</Tooltip>
							</div>
						</FuseAnimate>
					</div>
				</div>
			</ThemeProvider>
		);
	}
}

function mapStateToProps(state) {
	return {
		mainThemeDark: selectMainThemeDark(state)
	};
}

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(CalendarHeader));
