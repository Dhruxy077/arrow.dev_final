import React, { useEffect, useRef } from 'react';

export interface SilkProps {
    speed?: number;
    scale?: number;
    color?: string;
    noiseIntensity?: number;
    rotation?: number;
}

const SilkCanvas: React.FC<SilkProps> = ({
    speed = 5,
    scale = 1,
    color = '#7B7481',
    noiseIntensity = 1.5,
    rotation = 0
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Convert hex to RGB
        const hexToRGB = (hex: string): [number, number, number] => {
            const clean = hex.replace('#', '');
            const r = parseInt(clean.slice(0, 2), 16) / 255;
            const g = parseInt(clean.slice(2, 4), 16) / 255;
            const b = parseInt(clean.slice(4, 6), 16) / 255;
            return [r, g, b];
        };

        const rgb = hexToRGB(color);

        // Vertex shader
        const vertexShaderSource = `
      attribute vec2 aPosition;
      varying vec2 vUv;
      
      void main() {
        vUv = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

        // Fragment shader
        const fragmentShaderSource = `
      precision mediump float;
      varying vec2 vUv;
      
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uSpeed;
      uniform float uScale;
      uniform float uRotation;
      uniform float uNoiseIntensity;
      
      const float e = 2.71828182845904523536;
      
      float noise(vec2 texCoord) {
        float G = e;
        vec2 r = (G * sin(G * texCoord));
        return fract(r.x * r.y * (1.0 + texCoord.x));
      }
      
      vec2 rotateUvs(vec2 uv, float angle) {
        float c = cos(angle);
        float s = sin(angle);
        mat2 rot = mat2(c, -s, s, c);
        return rot * uv;
      }
      
      void main() {
        float rnd = noise(gl_FragCoord.xy);
        vec2 uv = rotateUvs(vUv * uScale, uRotation);
        vec2 tex = uv * uScale;
        float tOffset = uSpeed * uTime;
        
        tex.y += 0.03 * sin(8.0 * tex.x - tOffset);
        
        float pattern = 0.6 +
                        0.4 * sin(5.0 * (tex.x + tex.y +
                                         cos(3.0 * tex.x + 5.0 * tex.y) +
                                         0.02 * tOffset) +
                                 sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));
        
        vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
        col.a = 1.0;
        gl_FragColor = col;
      }
    `;

        // Compile shader
        const compileShader = (source: string, type: number): WebGLShader | null => {
            const shader = gl.createShader(type);
            if (!shader) return null;

            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        };

        // Create program
        const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
        const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program linking error:', gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        // Create quad
        const positions = new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            1, 1,
        ]);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const aPosition = gl.getAttribLocation(program, 'aPosition');
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        // Get uniform locations
        const uTime = gl.getUniformLocation(program, 'uTime');
        const uColor = gl.getUniformLocation(program, 'uColor');
        const uSpeed = gl.getUniformLocation(program, 'uSpeed');
        const uScale = gl.getUniformLocation(program, 'uScale');
        const uRotation = gl.getUniformLocation(program, 'uRotation');
        const uNoiseIntensity = gl.getUniformLocation(program, 'uNoiseIntensity');

        // Set uniforms
        gl.uniform3f(uColor, rgb[0], rgb[1], rgb[2]);
        gl.uniform1f(uSpeed, speed);
        gl.uniform1f(uScale, scale);
        gl.uniform1f(uRotation, rotation);
        gl.uniform1f(uNoiseIntensity, noiseIntensity);

        // Animation loop
        let startTime = Date.now();
        let animationId: number;

        const render = () => {
            const currentTime = (Date.now() - startTime) / 1000;

            gl.uniform1f(uTime, currentTime);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            animationId = requestAnimationFrame(render);
        };

        render();

        // Cleanup
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resizeCanvas);
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteBuffer(buffer);
        };
    }, [speed, scale, color, noiseIntensity, rotation]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full"
            style={{ display: 'block' }}
        />
    );
};

export default SilkCanvas;
