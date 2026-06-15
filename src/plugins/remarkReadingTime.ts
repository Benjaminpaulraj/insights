import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';
import type { Root } from 'mdast';
import type { VFile } from 'vfile';

export function remarkReadingTime() {
	return function (tree: Root, file: VFile) {
		const textContent = toString(tree);
		const { text } = getReadingTime(textContent);
		(file.data.astro as any).frontmatter.minutesRead = text;
	};
}
