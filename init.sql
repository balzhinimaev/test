CREATE TABLE IF NOT EXISTS sort_results (
    id SERIAL PRIMARY KEY,
    sort_id UUID NOT NULL,
    element_order INT NOT NULL,
    value INT NOT NULL
)