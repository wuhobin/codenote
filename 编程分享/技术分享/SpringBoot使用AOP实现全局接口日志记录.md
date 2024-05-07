---
tags:
  - AOP
  - SpringBoot开发小技巧
---

# SpringBoot使用AOP实现全局接口日志记录


> 本文作者：[程序员Aurora](/author.md)
>
> 本站地址：[https://codenote.wuhobin.top](https://codenote.wuhobin.top)


## 什么是AOP


AOP 是指通过预编译方式和运行期动态代理的方式，在不修改源代码的情况下对程序进行功能增强的一种技术。AOP 不是面向对象编程（OOP）的替代品，而是 OOP 的补充和扩展。</br>
它是一个新的维度，用来表达横切问题，并提供一个声明式的处理方案。AOP 是 Spring 框架中的一个重要特性。

## AOP使用场景

AOP 的使用场景一般是在某些纵向逻辑和多个相对独立的横向逻辑中，将横向逻辑进行抽象和封装，使得横向逻辑不再与纵向逻辑混杂在一起，使得应用程序更加易于维护和扩展。在实际开发中，AOP 的使用场景比较广泛，例如：

- 日志记录：在应用程序中，可以通过 AOP 对方法调用进行拦截，在方法调用前后记录日志信息。
- 安全处理：通过 AOP 实现安全方案，例如在应用程序中对某些敏感方法添加权限验证。
- 性能监控：对应用程序进行性能监控，实现性能分析和调优。
- 事物管理：通过 AOP 对事物进行管理，例如实现事物的回滚和提交。
- 缓存管理：对应用程序进行缓存管理，例如在读写操作中进行缓存。

## AOP 的核心概念

在学习 AOP 的过程中，有一些核心概念是相当重要的。

1. 连接点（JointPoint）
连接点是程序中可能被拦截的方法。在 AOP 中，连接点是指所有被拦截到的方法。连接点包含两个信息：一个是方法的位置信息，另一个是方法的名称。

2. 切点（Pointcut）
切点是一组连接点的集合，是要被拦截的连接点。在 Spring AOP 中，切点采用 AspectJ 的切点表达式进行描述，格式如 @Pointcut("execution(public * com.example.demo.controller.*.*(..))")。

3. 通知（Advice）
通知是指拦截到连接点后要执行的代码，包括 @Before、@AfterReturning、@AfterThrowing、@After 和 @Around 五种类型。

4. 切面（Aspect）
切面是一个包含通知和切点的对象，主要用来维护切点和通知之间的关系。

5. 织入（Weaving）
织入是将切面应用到目标对象来创建新的代理对象的过程。在 Spring AOP 中，织入可以在编译时、类加载时和运行时进行。



## AOP 的实现方式

在 SpringBoot 中，AOP 的实现方式主要有两种：Java 代理（JDK Proxy）和字节码增强（CGLIB）。

1. Java 代理（JDK Proxy）
Java 代理是一种基于接口的代理，通过实现 Java 动态代理接口 InvocationHandler 来实现对代理类方法的调用。Java 代理只能代理实现了接口的类，在运行时通过生成代理类的方式来实现。Java 代理的优点是操作简单，劣势是只能代理接口。

2. 字节码增强（CGLIB）
字节码增强是一种基于继承的代理，通过生成代理类来完成对目标对象方法的调用。CGLIB 代理不需要实现接口，对目标对象进行继承并重写其中的方法，从而实现对方法的调用拦截。字节码增强的优点是能够代理非接口的类，劣势是需要引入 CGLIB 依赖包。

## SpringBoot 使用AOP

我们创建一个日志切面来记录接口调用开始时间、结束时间、持续时间等(方法名、参数、返回值......)。

1. pom.xml文件添加以下依赖 

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-aop</artifactId>
        </dependency>
```


2. 新增*WebLog*实体类

```java
@Data
public class WebLog implements Serializable {

    private static final long serialVersionUID = 1L;


    /**
     * 操作用户
     */
    private String username;

    /**
     * 操作用户角色
     */
    private String userRole;

    /**
     * 操作时间
     */
    private Long startTime;

    /**
     * 消耗时间
     */
    private Integer spendTime;

    /**
     * 根路径
     */
    private String basePath;

    /**
     * URI
     */
    private String uri;

    /**
     * URL
     */
    private String url;

    /**
     * 请求类型
     */
    private String method;

    /**
     * IP地址
     */
    private String ip;

    /**
     * 请求参数
     */
    private Object parameter;

    /**
     * 返回数据
     */
    private Object result;

}
```

3. 编写统一日志记录切面

```java
/**
 * 统一日志处理切面
 * @author 刘博
 */
@Aspect
@Component
@Order(1)
@Slf4j
public class WebLogAspect {

    @Pointcut("@annotation(org.springframework.web.bind.annotation.RequestMapping)")
    public void requestLog() {
    }
    @Pointcut("@annotation(org.springframework.web.bind.annotation.GetMapping)")
    public void getLog() {
    }
    @Pointcut("@annotation(org.springframework.web.bind.annotation.PostMapping)")
    public void postLog() {
    }


    // 在方法执行之前进行通知
    @Before("requestLog() || getLog() || postLog()")
    public void before(JoinPoint joinPoint) {
        System.out.println("执行方法 " + joinPoint.getSignature().getName() + " 前置通知");
    }

    // 在方法执行之后进行通知
    @After("requestLog() || getLog() || postLog()")
    public void after(JoinPoint joinPoint) {
        System.out.println("执行方法 " + joinPoint.getSignature().getName() + " 后置通知");
    }

    // 在方法执行之后返回结果时进行通知
    @AfterReturning(returning = "result", pointcut = "requestLog() || getLog() || postLog()")
    public void afterReturning(JoinPoint joinPoint, Object result) {
        System.out.println("执行方法 " + joinPoint.getSignature().getName() + " 返回通知，返回值：" + result);
    }

    // 在方法抛出异常时进行通知
    @AfterThrowing(throwing = "ex", pointcut = "requestLog() || getLog() || postLog()")
    public void afterThrowing(JoinPoint joinPoint, Exception ex) {
        System.err.pzrintln("执行方法 " + joinPoint.getSignature().getName() + " 异常通知，异常：" + ex.getMessage());
    }

    @Around("requestLog() || getLog() || postLog()")
    public Object doAround(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        //获取当前请求对象
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        Object result = joinPoint.proceed();
        try {
            //生成web日志，不影响请求结果
            generatorWebLog(joinPoint, startTime, request, result);
        }catch (Exception e){
            log.error("web请求日志异常",e);
        }
        return result;
    }

    private void generatorWebLog(ProceedingJoinPoint joinPoint, long startTime, HttpServletRequest request, Object result) {
        WebLog webLog = new WebLog();
        long endTime = System.currentTimeMillis();
        String urlStr = request.getRequestURL().toString();
        webLog.setBasePath(StrUtil.removeSuffix(urlStr, URLUtil.url(urlStr).getPath()));
        webLog.setIp(WebUtils.getClientRealIp(request));
        webLog.setMethod(request.getMethod());
        webLog.setParameter(getParameter(joinPoint));
        webLog.setResult(result);
        webLog.setSpendTime((int) (endTime - startTime));
        webLog.setStartTime(startTime);
        webLog.setUri(request.getRequestURI());
        webLog.setUrl(request.getRequestURL().toString());
        webLog.setDescription(getDescription(joinPoint));
        log.info("web请求日志:{}", JSONUtil.parse(webLog));
    }

    /**
     * 根据方法和传入的参数获取请求参数
     */
    private Object getParameter(ProceedingJoinPoint joinPoint) {
        //获取方法签名
        MethodSignature signature =(MethodSignature) joinPoint.getSignature();
        //获取参数名称
        String[] parameterNames = signature.getParameterNames();
        //获取所有参数
        Object[] args = joinPoint.getArgs();
        //请求参数封装
        JSONObject jsonObject = new JSONObject();
        if(parameterNames !=null && parameterNames.length > 0){
            for(int i=0; i<parameterNames.length;i++){
                jsonObject.put(parameterNames[i],args[i]);
            }
        }
        return jsonObject;
    }

    /**
     * 获取方法描述
     */
    private String getDescription(ProceedingJoinPoint joinPoint) {
        //获取方法签名
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        //获取方法
        Method method = signature.getMethod();
        //获取注解对象
        //ApiOperation annotation = method.getAnnotation(ApiOperation.class);
//        if (Objects.isNull(annotation)) {
//            return "";
//        }
//        return annotation.value();
        return "";
    }
}
```

## 总结

以上就是 SpringBoot AOP 的基本用法，通过使用 SpringBoot AOP，我们可以在不修改源代码的情况下对程序进行功能增强，实现对方法的拦截、日志记录、权限验证、性能监控等功能。