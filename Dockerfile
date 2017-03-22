FROM starefossen/github-pages:onbuild
ADD ./Gemfile* /tmp/
RUN cd /tmp/ && bundle install
CMD bundle exec jekyll serve -d /_site --watch --force_polling -H 0.0.0.0 -P 4000