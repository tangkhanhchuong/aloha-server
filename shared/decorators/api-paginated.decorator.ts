import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PaginatedResponseDTO } from '../dto/paginated.response.dto';

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
	return applyDecorators(
		ApiExtraModels(PaginatedResponseDTO, model),
		ApiOkResponse({
			description: 'Successfully received model list',
			schema: {
				allOf: [
					{ $ref: getSchemaPath(PaginatedResponseDTO) },
					{
						properties: {
							items: {
								type: 'array',
								items: { $ref: getSchemaPath(model) },
							},
						},
					},
				],
			},
		}),
	);
};
