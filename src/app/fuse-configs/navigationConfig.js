import i18next from 'i18next';

import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
	{
		id: 'applications',
		title: '',
		translate: 'APPLICATIONS',
		type: 'group',
		icon: 'apps',
		children: [
			{
				id: 'academy',
				title: 'Academy',
				translate: 'ACADEMY',
				type: 'item',
				icon: 'check_box',
				url: '/apps/academy/'
			},
			{
				id: 'mail',
				title: 'Mail',
				translate: 'MAIL',
				type: 'item',
				icon: 'fact_check',
				url: '/apps/mail',
				badge: {
					title: 1,
					bg: '#F44336',
					fg: '#FFFFFF'
				}
			},
			{
				id: 'todo',
				title: 'To-Do',
				translate: 'TODO',
				type: 'item',
				icon: 'notifications_none',
				url: '/apps/todo',
				badge: {
					title: 2,
					bg: '#F44336',
					fg: '#FFFFFF'
				}
			},
			{
				id: 'file-manager',
				title: 'File Manager',
				translate: 'FILE_MANAGER',
				type: 'item',
				icon: 'wysiwyg',
				url: '/apps/file-manager'
			},
			{
				id: 'contacts',
				title: 'Contacts',
				translate: 'CONTACTS',
				type: 'item',
				icon: 'account_box',
				url: '/apps/contacts/all'
			}
		]
	},
	{
		id: 'calendar',
		title: '',
		translate: 'APPLICATIONS',
		type: 'group',
		icon: 'apps',
		children: [
			{
				id: 'calendar',
				title: 'Calendar',
				translate: 'CALENDAR',
				type: 'item',
				icon: 'today',
				url: '/apps/calendar'
			}
		]
	}
];

export default navigationConfig;
