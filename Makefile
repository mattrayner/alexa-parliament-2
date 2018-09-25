db: db-start db-create

db-build:
	docker-compose -f docker-compose.test.yml build

db-start:
	docker-compose -f docker-compose.test.yml up -d

db-create:
	AWS_REGION=eu-west-1 aws dynamodb create-table --table-name parliament --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --endpoint-url http://localhost:8000

db-stop:
	docker-compose -f docker-compose.test.yml stop

test:
	(cd lambda && npm test)

compile:
	./lambda/node_modules/typescript/bin/tsc -p ./lambda/

dependencies:
	rm -r ./lambda/node_modules
	(cd lambda && npm install --only=production)
	cp -r ./lambda/node_modules ./lambda/dist/
