# convert markdown to html

## init:
```javascript
let m = new Markdown ( );
m.parse ( txt );
```

## get base md:
```javascript
m.md
```

## get base html:
```javascript
m.html
```

## test :
```markdown
# hello, markdown!
![image](imgs/logo.png =100x100)
[link](https://google.com)
## table
| h1    |    h2   |      h3 |
|:------|:-------:|--------:|
| 100   | [google](https://google.com)  | ![image](imgs/logo.png =15x15) |
| _foo_ | **bar** | ~~baz~~ |
## simley
---
:smile:
:sob:
## code
aaa aa aaa aa aaaa aa aa aa aaaaa
aaa aa aaa aa `aaaa` aa aa aa aaaaa
> aaa aa aaa aa aaaa aa aa aa aaaaa
aaa aa aaa aa aaaa aa aa aa aaaaa
## checkbox
-[ ] no marque
-[x] marque
```