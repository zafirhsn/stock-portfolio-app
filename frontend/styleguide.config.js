module.exports = {
	// set your styleguidist configuration here
	title: 'Stock App Style Guide',
	sections: [
		{
			name: 'Components',
			components: 'src/components/*.vue'
		},
		{
			name: 'Pages',
			components: 'src/pages/*.vue'
		}
	],
	// components: 'src/(components)|(pages)*/**/*.vue',
	// defaultExample: true,
	// sections: [
	//   {
	//     name: 'First Section',
	//     components: 'src/components/**/[A-Z]*.vue'
	//   }
	// ],
	// webpackConfig: {
	//   // custom config goes here
	// },
	exampleMode: 'expand'
}
