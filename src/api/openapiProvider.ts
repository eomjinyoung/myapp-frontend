export interface Operation {
    method: string;
    path: string;
    operationId: string;
    summary?: string;
    description?: string;
    tags: string[];
    security?: any[];
}

export interface TagGroup {
    name: string;
    operations: Operation[];
}

export interface OpenAPISpec {
    info: {
        title: string;
        version: string;
    };
    tags?: { name: string; description?: string }[];
    paths: Record<string, any>;
}

/**
 * openapi.json을 로드하고 태그별로 그룹화된 데이터를 제공합니다.
 */
export async function fetchOpenAPISpec(): Promise<TagGroup[]> {
    try {
        // 1. openapi.json 페치 (루트에 위치하거나 public에 있을 것을 가정)
        const response = await fetch("/openapi.json");
        if (!response.ok) {
            throw new Error("openapi.json을 불러올 수 없습니다.");
        }
        const spec: OpenAPISpec = await response.json();

        // 2. paths 파싱하여 작업 목록 생성
        const operations: Operation[] = [];

        Object.entries(spec.paths).forEach(([path, methods]) => {
            Object.entries(methods).forEach(([method, detail]: [string, any]) => {
                // HTTP 메서드 필터링
                if (!["get", "post", "put", "delete", "patch"].includes(method.toLowerCase())) {
                    return;
                }

                operations.push({
                    method: method.toUpperCase(),
                    path,
                    operationId: detail.operationId || `${method}-${path.replace(/\//g, "-")}`,
                    summary: detail.summary,
                    description: detail.description,
                    tags: detail.tags || ["default"],
                    security: detail.security,
                });
            });
        });

        // 3. 태그별 그룹화
        const tagGroups: Record<string, Operation[]> = {};

        operations.forEach((op) => {
            op.tags.forEach((tag) => {
                if (!tagGroups[tag]) {
                    tagGroups[tag] = [];
                }
                tagGroups[tag].push(op);
            });
        });

        // 4. 배열로 변환하여 반환
        return Object.entries(tagGroups).map(([name, ops]) => ({
            name,
            operations: ops,
        }));
    } catch (error) {
        console.error("OpenAPI 파싱 실패:", error);
        return [];
    }
}
