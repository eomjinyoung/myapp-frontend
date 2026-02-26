# AI Agent Guide for My REST App

이 파일은 코딩 에이전트가 이 프로젝트의 맥락을 이해하고 일관성 있게 작업을 수행할 수 있도록 돕기 위한 지침서이다.

## 프로젝트 개요
- **목적**: REST API 서버(Spring Boot 기반)에서 제공하는 OpenAPI 명세를 바탕으로 한 현대적인 프론트엔드 웹 서비스 구축.
- **아키텍처**: Node.js + Express (프론트엔드 서버) + 정적 HTML 페이지 기반의 MPA(Multi-Page Application) 구조.

## 작업 완료할 때마다 할 일
- **작업 내용의 정상 동작을 확인(검증)한 후**, 정의된 형식에 맞춰 `git commit` 및 `git push`를 수행한다.
- **Git Commit 메시지 형식**: `docs/git-message-format.md`를 엄격히 준수한다.

## 에이전트 주의 사항
- **REST API 요청**: 프론트엔드 서버를 통한 프록시가 아닌, 클라이언트(브라우저)에서 REST API 서버(`http://localhost:8080`)로 직접 요청을 보낸다.
