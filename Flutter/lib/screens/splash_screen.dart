import 'package:edu_flex/screens/login_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 3), () {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => const Login_Screen()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 230,
            height: 220,
            transformAlignment: Alignment.center,
            child: CircleAvatar(
              backgroundColor: Color(0xffFFFBFE),
              radius: 140,
              child: Image.asset(
                'assets/images/splash_screen/splash_logo.png',
              ),
            ),
          ),
          SizedBox(
            height: 190,
            width: 258,
            child: Image.asset(
              'assets/images/splash_screen/text_splash.png',
              alignment: Alignment.topCenter,
            ),
          ),
          const SizedBox(height: 50,),
          const SpinKitThreeBounce(
            size: 50,
            color: Color(0xff00BF63),
          ),
        ],
      ),
    );
  }
}
