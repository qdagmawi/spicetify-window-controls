Add-Type @'
using System;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public class WinUtil {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc enumProc, IntPtr lParam);
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
    [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder text, int count);
    [DllImport("user32.dll")] public static extern int GetClassName(IntPtr hWnd, System.Text.StringBuilder text, int count);
    [DllImport("user32.dll")] public static extern bool GetWindowPlacement(IntPtr hWnd, ref WINDOWPLACEMENT lpwndpl);

    public struct POINT { public int x; public int y; }
    public struct RECT { public int left; public int top; public int right; public int bottom; }
    public struct WINDOWPLACEMENT {
        public int length;
        public int flags;
        public int showCmd;
        public POINT ptMinPosition;
        public POINT ptMaxPosition;
        public RECT rcNormalPosition;
    }

    public static void CheckSpotify() {
        var pids = new HashSet<uint>();
        foreach (var p in System.Diagnostics.Process.GetProcessesByName("Spotify")) {
            pids.Add((uint)p.Id);
        }
        EnumWindows((hWnd, lParam) => {
            uint pid;
            GetWindowThreadProcessId(hWnd, out pid);
            if (pids.Contains(pid)) {
                var sbClass = new System.Text.StringBuilder(256);
                GetClassName(hWnd, sbClass, 256);
                var sbText = new System.Text.StringBuilder(256);
                GetWindowText(hWnd, sbText, 256);
                var wp = new WINDOWPLACEMENT();
                wp.length = Marshal.SizeOf(wp);
                GetWindowPlacement(hWnd, ref wp);
                if (sbText.Length > 0 || sbClass.ToString().StartsWith("Chrome")) {
                    Console.WriteLine("hWnd: 0x{0:X}, PID: {1}, Visible: {2}, ShowCmd: {3}, Class: {4}, Title: {5}",
                        hWnd.ToInt64(), pid, IsWindowVisible(hWnd), wp.showCmd, sbClass, sbText);
                }
            }
            return true;
        }, IntPtr.Zero);
    }
}
'@
[WinUtil]::CheckSpotify()
