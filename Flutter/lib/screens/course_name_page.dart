import 'package:flutter/material.dart';

import '../classes/class_color.dart';
import '../components/navigator_button.dart';

class CourseNamePage extends StatefulWidget {
  const CourseNamePage({super.key});

  @override
  State<CourseNamePage> createState() => _CourseNamePageState();
}

class _CourseNamePageState extends State<CourseNamePage> {
  GlobalKey<ScaffoldState> scaffoldkey = GlobalKey();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldkey,
      endDrawer: Drawer(
        clipBehavior: Clip.antiAliasWithSaveLayer,
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 32),
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Image.asset('assets/images/course_name_screen/course name.png'),
                IconButton(
                    onPressed: () {
                      scaffoldkey.currentState!.closeEndDrawer();
                    },
                    icon: const Icon(
                      Icons.menu_rounded,
                      size: 35,
                    )),
              ],
            ),
            const Divider(),
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: Row(
                children: [
                  Text(
                    'NAME OF CHAPTER',
                    style: TextStyle(
                        fontFamily: 'Roboto',
                        fontSize: 15,
                        fontWeight: FontWeight.w700),
                  )
                ],
              ),
            ),
            const Divider(),
            Container(
              width: 297,
              height: 55,
              color: ColorManager.lightGray,
              child: const Row(
                children: [
                  Icon(
                    Icons.slow_motion_video,
                    color: ColorManager.mainGreen,
                  ),
                  SizedBox(
                    width: 10,
                  ),
                  Text(
                    'video 1 (1:52)',
                    style: TextStyle(
                        color: ColorManager.mainGreen,
                        fontFamily: 'Roboto',
                        fontSize: 15,
                        fontWeight: FontWeight.w700),
                  )
                ],
              ),
            ),
            const Divider(),
            Container(
              width: 297,
              height: 55,
              color: ColorManager.lightGray,
              child: const Row(
                children: [
                  Icon(
                    Icons.slow_motion_video,
                    color: ColorManager.mainGreen,
                  ),
                  SizedBox(
                    width: 10,
                  ),
                  Text(
                    'video 2 (5:54)',
                    style: TextStyle(
                        color: ColorManager.mainGreen,
                        fontFamily: 'Roboto',
                        fontSize: 15,
                        fontWeight: FontWeight.w700),
                  ),
                ],
              ),
            ),
            const Divider(),
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: Row(
                children: [
                  Text(
                    'NAME OF CHAPTER',
                    style: TextStyle(
                        fontFamily: 'Roboto',
                        fontSize: 15,
                        fontWeight: FontWeight.w700),
                  )
                ],
              ),
            ),
            const Divider(),
            Container(
              width: 297,
              height: 55,
              color: ColorManager.lightGray,
              child: const Row(
                children: [
                  Icon(
                    Icons.slow_motion_video,
                    color: ColorManager.mainGreen,
                  ),
                  SizedBox(
                    width: 10,
                  ),
                  Text(
                    'video 1 (1:52)',
                    style: TextStyle(
                        color: ColorManager.mainGreen,
                        fontFamily: 'Roboto',
                        fontSize: 15,
                        fontWeight: FontWeight.w700),
                  )
                ],
              ),
            ),
            const Divider(),
            Container(
              width: 297,
              height: 55,
              color: ColorManager.lightGray,
              child: const Row(
                children: [
                  Icon(
                    Icons.slow_motion_video,
                    color: ColorManager.mainGreen,
                  ),
                  SizedBox(
                    width: 10,
                  ),
                  Text(
                    'video 2 (5:54)',
                    style: TextStyle(
                        color: ColorManager.mainGreen,
                        fontFamily: 'Roboto',
                        fontSize: 15,
                        fontWeight: FontWeight.w700),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      appBar: AppBar(
        elevation: 0,
        title: Image.asset('assets/images/course_name_screen/course name.png'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.menu_rounded, size: 35),
            onPressed: () {
              scaffoldkey.currentState!.openEndDrawer();
            },
          ),
          const SizedBox(
            width: 12,
          )
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Row(
            children: [
              Text(
                'VIDEO TITLE',
                style: TextStyle(
                  fontFamily: 'Roboto',
                  fontSize: 22,
                  fontWeight: FontWeight.w600,
                ),
              )
            ],
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset('assets/images/course_name_screen/videophoto.png')
            ],
          ),
          MyNavigatorButton(
              textColor: Colors.white,
              onTap: () {},
              height: 41,
              width: 212,
              color: ColorManager.mainGreen,
              text: 'COMPLETE AND Continue >')
        ],
      ),
    );
  }
}
