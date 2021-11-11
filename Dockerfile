FROM openjdk:8-alpine

COPY target/uberjar/opinionneeded.jar /opinionneeded/app.jar

EXPOSE 3000

CMD ["java", "-jar", "/opinionneeded/app.jar"]
