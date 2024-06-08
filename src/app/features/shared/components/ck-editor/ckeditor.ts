// /**
//  * @license Copyright (c) 2014-2024, CKSource Holding sp. z o.o. All rights reserved.
//  * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
//  */

// import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

// import { Alignment } from '@ckeditor/ckeditor5-alignment';
// import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
// import {
// 	Bold,
// 	Code,
// 	Italic,
// 	Strikethrough,
// 	Subscript,
// 	Superscript,
// 	Underline
// } from '@ckeditor/ckeditor5-basic-styles';
// import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
// import type { EditorConfig } from '@ckeditor/ckeditor5-core';
// import { Essentials } from '@ckeditor/ckeditor5-essentials';
// import { FontColor, FontSize } from '@ckeditor/ckeditor5-font';
// import { Heading } from '@ckeditor/ckeditor5-heading';
// import { Indent, IndentBlock } from '@ckeditor/ckeditor5-indent';
// import { Link } from '@ckeditor/ckeditor5-link';
// import { List } from '@ckeditor/ckeditor5-list';
// import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
// import {
// 	Table,
// 	TableCaption,
// 	TableCellProperties,
// 	TableColumnResize,
// 	TableProperties,
// 	TableToolbar
// } from '@ckeditor/ckeditor5-table';
// import { TextTransformation } from '@ckeditor/ckeditor5-typing';
// import { Undo } from '@ckeditor/ckeditor5-undo';
// import {
// 	Image,
// 	ImageUpload,
// } from '@ckeditor/ckeditor5-image';

// // You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// // See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

// class Editor extends ClassicEditor {
// 	public static override builtinPlugins = [
// 		Alignment,
// 		Autoformat,
// 		Bold,
// 		Code,
// 		CodeBlock,
// 		Essentials,
// 		FontColor,
// 		FontSize,
// 		Heading,
// 		Indent,
// 		IndentBlock,
// 		Italic,
// 		Link,
// 		List,
// 		Paragraph,
// 		Strikethrough,
// 		Subscript,
// 		Superscript,
// 		Table,
// 		TableCaption,
// 		TableCellProperties,
// 		TableColumnResize,
// 		TableProperties,
// 		TableToolbar,
// 		TextTransformation,
// 		Underline,
// 		Undo,
// 		Image,
// 		ImageUpload
// 	];

// 	public static override defaultConfig: EditorConfig = {
// 		toolbar: {
// 			items: [
// 				'undo',
// 				'redo',
// 				'|',
// 				'heading',
// 				'|',
// 				'fontColor',
// 				'fontSize',
// 				'|',
// 				'bold',
// 				'italic',
// 				'strikethrough',
// 				'underline',
// 				'|',
// 				'bulletedList',
// 				'numberedList',
// 				'|',
// 				'alignment',
// 				'outdent',
// 				'indent',
// 				'subscript',
// 				'superscript',
// 				'|',
// 				'insertTable',
// 				'link',
// 				'|',
// 				'ImageUpload'
// 			]
// 		},
// 		language: 'en',
// 		table: {
// 			contentToolbar: [
// 				'tableColumn',
// 				'tableRow',
// 				'mergeTableCells',
// 				'tableCellProperties',
// 				'tableProperties'
// 			]
// 		}
// 	};
// }

// export default Editor;
