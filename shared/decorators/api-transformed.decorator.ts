import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { TransformedResponseDTO } from '../dto/transformed-response.dto';

export const TransformedResponse = <TModel extends Type<any>>(model: TModel) => {
	return applyDecorators(
		ApiExtraModels(TransformedResponseDTO),
		ApiOkResponse({
			description: 'Successfully received model list',
			schema: {
				allOf: [
					{ $ref: getSchemaPath(TransformedResponseDTO) },
					{
						properties: {
							data: {
								$ref: getSchemaPath(model),
							},
						},
					},
				],
			},
		}),
	);
};
