.PHONY: runserver makemigrations makemigrationapp migrate
runserver :
	python manage.py runserver --settings=GUMA_investimentos.local_settings
makemigrations :
	python manage.py makemigrations --settings=GUMA_investimentos.local_settings
# make makemigrationapp app=app
makemigrationapp :
	python manage.py makemigrations --settings=GUMA_investimentos.local_settings $(app)
migrate :
	python manage.py migrate --settings=GUMA_investimentos.local_settings