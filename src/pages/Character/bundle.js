export const List = r => require.ensure([], () => r(require('./List.vue')), 'character');
export const Edit = {
	sub:true,
	path:'/character/edit/:id',
	component:r => require.ensure([], () => r(require('./Edit.vue')), 'character')
}
