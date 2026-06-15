import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

export async function getStaticPaths() {
	const posts = await getCollection('blog', ({ data }) => !data.draft);
	return posts.map((post) => ({
		params: { slug: post.id },
		props: { title: post.data.title, description: post.data.description, tags: post.data.tags ?? [] },
	}));
}

interface Props {
	title: string;
	description: string;
	tags: string[];
}

export const GET: APIRoute<Props> = async ({ props }) => {
	const { title, description, tags } = props;

	const fontPath = path.resolve('./src/assets/fonts/atkinson-bold.woff');
	const fontData = fs.readFileSync(fontPath);

	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					width: '1200px',
					height: '630px',
					background: 'linear-gradient(135deg, #0f1219 0%, #1a1f2e 100%)',
					padding: '60px',
					fontFamily: 'Atkinson',
					color: '#e5e9f0',
				},
				children: [
					{
						type: 'div',
						props: {
							style: { display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 },
							children: [
								tags.length > 0
									? {
											type: 'div',
											props: {
												style: {
													display: 'flex',
													gap: '8px',
												},
												children: tags.slice(0, 3).map((tag) => ({
													type: 'div',
													props: {
														style: {
															fontSize: '14px',
															fontWeight: 600,
															padding: '4px 12px',
															borderRadius: '999px',
															background: 'rgba(129, 140, 248, 0.15)',
															border: '1px solid rgba(129, 140, 248, 0.3)',
															color: '#818cf8',
														},
														children: `#${tag}`,
													},
												})),
											},
										}
									: null,
								{
									type: 'div',
									props: {
										style: {
											fontSize: title.length > 60 ? '42px' : '52px',
											fontWeight: 700,
											lineHeight: 1.15,
											color: '#ffffff',
											maxWidth: '1000px',
										},
										children: title,
									},
								},
								{
									type: 'div',
									props: {
										style: {
											fontSize: '22px',
											color: '#8892a4',
											lineHeight: 1.5,
											maxWidth: '900px',
										},
										children: description.length > 120 ? description.slice(0, 117) + '…' : description,
									},
								},
							].filter(Boolean),
						},
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								borderTop: '1px solid rgba(255,255,255,0.1)',
								paddingTop: '24px',
							},
							children: [
								{
									type: 'div',
									props: {
										style: { fontSize: '20px', fontWeight: 700, color: '#818cf8' },
										children: "Benjamin's Insights",
									},
								},
								{
									type: 'div',
									props: {
										style: { fontSize: '16px', color: '#8892a4' },
										children: 'benjaminpaulraj.github.io/insights',
									},
								},
							],
						},
					},
				],
			},
		},
		{
			width: 1200,
			height: 630,
			fonts: [{ name: 'Atkinson', data: fontData, weight: 700, style: 'normal' }],
		},
	);

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
	const png = resvg.render().asPng();

	return new Response(png, {
		headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000' },
	});
};
